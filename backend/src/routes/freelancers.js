import express from "express";
import { getAllFreelancers } from "../controllers/freelancerController.js";

const router = express.Router();

// GET /api/freelancers/
router.get("/", getAllFreelancers);

export default router;
