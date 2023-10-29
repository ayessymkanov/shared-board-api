import { Response, Request, NextFunction } from "express";

export function error(err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(500).json({
    data: null,
    error: {
      message: err.message,
    },
  });
}
