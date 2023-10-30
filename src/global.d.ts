import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

declare global {
  type Context = {
    user?: User;
  }

  namespace Express {
    export interface Request {
      language?: Language;
      user?: JwtPayload;
    }
  }
}
