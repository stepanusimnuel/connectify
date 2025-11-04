import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "./generated/prisma/index.js";
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/users.js";
import projectRoutes from "./src/routes/projects.js";
import freelancerRoutes from "./src/routes/freelancers.js";
import uploadRoutes from "./src/routes/uploads.js";
import applicationRoutes from "./src/routes/applications.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/uploads", uploadRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Connectify Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
