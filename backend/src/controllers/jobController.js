import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.id; // didapat dari JWT token
    const jobs = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch company jobs" });
  }
};

// Ambil semua aplikasi milik freelancer login
export const getFreelancerApplications = async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { freelancerId: req.user.id },
      include: { job: { select: { title: true, companyId: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch freelancer applications" });
  }
};
