import express from "express";
import { uploadImage, uploadMiddleware } from "../controllers/uploadImageController.js";

const router = express.Router();

// POST /api/upload
router.post("/", uploadMiddleware, uploadImage);

export default router;
