import express from "express";
import {
  createProject,
  getCompanyProjects,
  closeJob,
  approveFreelancer,
  updateProject,
  rejectFreelancer,
  getFreelancerProjects,
  applyToProject,
  unapplyProject,
  getFreelancerWork,
  getFinancialStats,
  completeProject,
  getAllProjects,
  getProjectById,
} from "../controllers/projectController.js";

const router = express.Router();

/* COMPANY */
router.get("/company/:type", getAllProjects);
router.get("/company/all/:companyId", getCompanyProjects);
router.get("/company/:type/:jobId", getProjectById);
router.put("/company/close/:jobId", closeJob);
router.put("/company/complete/:projectId", completeProject);
router.put("/company/update/:projectId", updateProject);
router.put("/company/reject/:applicationId", rejectFreelancer);
router.post("/company", createProject);
router.post("/company/approve", approveFreelancer);

/* FREELANCER */
router.get("/freelancer/:freelancerId", getFreelancerProjects);
router.get("/freelancer/:freelancerId/work", getFreelancerWork);
router.post("/freelancer/apply", applyToProject);
router.delete("/freelancer/unapply/:applicationId", unapplyProject);

router.get("/finance/:userId", getFinancialStats);

export default router;
