import express from "express";
import { getTopFreelancers } from "../controllers/userController.js";

const router = express.Router();

router.get("/top-freelancers", getTopFreelancers);

export default router;
