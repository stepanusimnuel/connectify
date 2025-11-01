import express from "express";
import { getAllFreelancers, getMyProfile, updateMyProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/freelancers", getAllFreelancers);

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

export default router;
