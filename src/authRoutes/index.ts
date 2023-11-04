import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { sub } from "date-fns";
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

    const pendingInvitations = await prisma.pendingMember.findMany({
      where: {
        email,
      },
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

    if (pendingInvitations?.length > 0 && newUser) {
      for (const invitation of pendingInvitations) {
        promises.push(await prisma.userTeam.create({
          data: {
            team_id: invitation.teamId,
            user_id: newUser.id,
          },
        }));
      }
    }

    await Promise.all(promises);

    const token = jsonwebtoken.sign(
      { id: newUser?.id, email: newUser?.email, name: newUser.name, personalBoardId: personalBoard.id },
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

router.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      data: null,
      error: {
        message: 'No email was provided',
      },
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (!user) {
      console.log('no user');
      throw new Error('No user with that email found');
    }

    const forgotPasswordId = generateRandomString();
    await prisma.forgotPassword.create({
      data: {
        id: forgotPasswordId,
        email,
      },
    });
    const link = `${process.env.CLIENT_ORIGIN}/reset/${forgotPasswordId}`;

    sendEmail({
      to: email,
      subject: 'Reset your password link',
      name: 'forgotPassword',
      templateArgs: { link }
    });

    return res.status(200).json({
      data: 'Success',
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/validate-reset', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      data: null,
      error: {
        message: 'Link is incorrect',
      },
    });
  }

  try {
    const forgotPasswordRecord = await prisma.forgotPassword.findUnique({
      where: {
        id,
      },
    });

    if (!forgotPasswordRecord) {
      throw new Error('Link is incorrect');
    }

    const tenMinutesAgo = sub(new Date(), {
      minutes: 10,
    });

    if (new Date(forgotPasswordRecord.createdAt).getTime() <= tenMinutesAgo.getTime()) {
      throw new Error('Link has expired');
    }

    return res.status(200).json({
      data: {
        email: forgotPasswordRecord.email
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      data: null,
      error: {
        message: 'Check your payload, email or password is missing',
      },
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        passwordHash: await bcrypt.hash(password, 10),
      },
    });

    return res.status(200).json({
      data: 'Success',
      error: null,
    });
  } catch (err) {
    next(err);
  }
});
export default router;
