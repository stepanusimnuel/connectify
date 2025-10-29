import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
};
