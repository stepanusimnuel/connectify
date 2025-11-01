import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// Verifikasi token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      console.log("Auth header:", req.headers.authorization);
      console.log("Decoded token:", decoded);
      console.log("User from DB:", user);
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      // console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Access denied" });
  }
};

// Role-based middleware
export const protectCompany = (req, res, next) => {
  if (req.user.role === "COMPANY") return next();
  return res.status(403).json({ message: "Access denied: company only" });
};

export const protectFreelancer = (req, res, next) => {
  if (req.user.role === "FREELANCER") return next();
  return res.status(403).json({ message: "Access denied: freelancer only" });
};
