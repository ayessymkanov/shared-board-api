import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { sub } from "date-fns";
import nodemailer from "nodemailer";
import prisma from "../prismaClient";
import { generateRandomString, getUser } from "../utils";
import { sendEmail } from "../utils/email";

const router = Router();

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (!user) {
      throw new Error('No user with that email found');
    }
    const validCreds = await bcrypt.compare(password, user.passwordHash);
    if (!validCreds) {
      throw new Error('Not valid credentials');
    }

    if (!user.isActive) {
      throw new Error('User is not activated');
    }

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email, name: user.name, personalBoardId: user.personalBoardId, isActive: user?.isActive },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' }
    );

    return res.status(200).json({
      data: { token },
      error: null,
    });
  } catch (err) {
    next(err)
  }
});

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email,
    }
  });
  if (user?.id) {
    return next(new Error('User with that email already exists'));
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
      }
    });

    const personalBoard = await prisma.team.create({
      data: {
        name: "Personal",
        adminId: newUser.id,
      }
    });

    const promises = [
      await prisma.userTeam.create({
        data: {
          team_id: personalBoard.id,
          user_id: newUser.id,
        },
      }),
      await prisma.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          personalBoardId: personalBoard.id,
        },
      }),
    ];

    await Promise.all(promises);

    const token = jsonwebtoken.sign(
      { id: newUser?.id, email: newUser?.email, name: newUser.name, personalBoardId: newUser.personalBoardId },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' },
    );

    const verificationId = generateRandomString();

    const ver = await prisma.verification.create({
      data: {
        id: verificationId,
        token,
      },
    });

    const link = `${process.env.CLIENT_ORIGIN}/verify/${ver.id}`;
    sendEmail({ to: email, subject: 'Confirm your email.', name: 'verify', templateArgs: { link } });

    return res.status(201).json({
      data: {
        message: 'Sent an email with verification link',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/verify", async (req: Request, res: Response, next: NextFunction) => {
  const { verificationId } = req.body;

  try {
    const verification = await prisma.verification.findUnique({
      where: {
        id: verificationId,
      },
    });

    if (!verification) {
      throw new Error('Incorrect link');
    }

    const tenMinutesAgo = sub(new Date(), {
      minutes: 10,
    });

    if (verification && new Date(verification.createdAt).getTime() <= tenMinutesAgo.getTime()) {
      throw new Error('Link has expired');
    }

    const user = getUser(verification?.token);

    await prisma.user.update({
      where: {
        // @ts-ignore
        id: user?.id,
      },
      data: {
        isActive: true,
      }
    });

    return res.status(200).json({
      data: {
        token: verification?.token,
        error: null,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/resend", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('No user with that email found.');
    }

    if (user.isActive) {
      throw new Error('User has already been activated.');
    }

    const { id, email: userEmail, name, personalBoardId, isActive } = user;
    const token = jsonwebtoken.sign(
      { id, email: userEmail, name, personalBoardId, isActive, },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' }
    );

    const verificationId = generateRandomString();

    const ver = await prisma.verification.create({
      data: {
        id: verificationId,
        token,
      },
    });

    const link = `${process.env.CLIENT_ORIGIN}/verify/${ver.id}`;
    sendEmail({ to: email, subject: 'Confirm your email.', name: 'verify', templateArgs: { link } });
  } catch (err) {
    next(err);
  }
});

export default router;
