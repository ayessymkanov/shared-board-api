import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils";
import { JwtPayload } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers.cookie);
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = getUser(token);

  if (!user) {
    return res.status(401).json({
      data: null,
      error: {
        message: 'Access denied',
      },
    });
  }
  req.user = user as JwtPayload;
  next();
}
