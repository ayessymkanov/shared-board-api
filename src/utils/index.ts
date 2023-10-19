import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const getUser = (token?: string) => {
  try {
    if (!token) {
      return null;
    }
    const user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return user;
  } catch (err) {
    return null;
  }
}
