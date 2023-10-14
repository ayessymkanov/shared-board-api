import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const getUser = async (token?: string) => {
  try {
    if (!token) {
      return null;
    }
    const user = await jwt.verify(token, JWT_SECRET, { algorithms: ['HS256']});
    return user;
  } catch (err) {
    return null
  }
}