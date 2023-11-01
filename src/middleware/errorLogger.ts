import { Response, Request, NextFunction } from "express";

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log({ logger: err.stack });
  next(err);
}
