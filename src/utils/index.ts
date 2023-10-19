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

export const convertToDate = (timestamp: number | Date) => {
  const date = new Date(timestamp);
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}
