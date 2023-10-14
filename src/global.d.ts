import { User } from "@prisma/client"

declare global {
  type Context = {
    user?: User;
  }
}