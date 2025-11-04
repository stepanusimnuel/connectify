import express from "express";
import { updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

// PATCH /api/applications/:applicationId/status
router.patch("/:applicationId/status", updateApplicationStatus);

export default router;
