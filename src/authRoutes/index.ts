import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../prismaClient";

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

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.email, name: user.name, personalBoardId: user.personalBoardId, },
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

    return res.status(201).json({
      data: {
        token,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
