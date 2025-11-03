import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

/* ===================== COMPANY ===================== */

export const getAllProjects = async (req, res) => {
  const type = req.params.type.toUpperCase();
  try {
    const projects = await prisma.job.findMany({
      where: { type: type },
      include: {
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    let { type, jobId } = req.params;
    type = type.toUpperCase();

    if (!["JOB", "COURSE"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'job' or 'course'." });
    }

    let data;

    if (type === "JOB") {
      data = await prisma.job.findUnique({
        where: { id: Number(jobId) },
        include: {
          company: true,
        },
      });
    } else if (type === "COURSE") {
      data = await prisma.course.findUnique({
        where: { id: Number(jobId) },
        include: {
          company: true,
        },
      });
    }

    if (!data) {
      return res.status(404).json({ message: `${type} not found` });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all projects by company id (job & course)
export const getCompanyProjects = async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const projects = await prisma.job.findMany({
      where: { companyId },
      include: {
        applications: {
          include: { freelancer: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new job or course (Company only)
export const createProject = async (req, res) => {
  try {
    const { title, description, specialty, minSalary, maxSalary, image, location, applicationDeadline, contractDeadline, type, companyId, paymentAmount } = req.body;

    // Validasi tipe project
    if (!["JOB", "COURSE"].includes(type)) {
      return res.status(400).json({ message: "Invalid project type" });
    }

    // Validasi tanggal
    if (new Date(applicationDeadline) > new Date(contractDeadline)) {
      return res.status(400).json({
        message: "Application deadline must be before contract deadline",
      });
    }

    // Simpan ke database
    const newProject = await prisma.job.create({
      data: {
        title,
        description,
        specialty,
        minSalary: parseInt(minSalary),
        maxSalary: parseInt(maxSalary),
        image,
        location,
        applicationDeadline: new Date(applicationDeadline),
        contractDeadline: new Date(contractDeadline),
        type,
        companyId: parseInt(companyId),
        paymentAmount: parseInt(paymentAmount) || 0,
      },
    });

    res.status(201).json({
      message: `${type} project created successfully`,
      project: newProject,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, specialty, minSalary, maxSalary, image, location, applicationDeadline, hiredFreelancerId, contractDeadline, status, paymentAmount, type } = req.body;

    // Pastikan project-nya ada
    const project = await prisma.job.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project
    const updatedProject = await prisma.job.update({
      where: { id: parseInt(projectId) },
      data: {
        title,
        description,
        specialty,
        minSalary,
        maxSalary,
        image,
        location,
        hiredFreelancerId,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : project.applicationDeadline,
        contractDeadline: contractDeadline ? new Date(contractDeadline) : project.contractDeadline,
        status,
        paymentAmount,
        type,
      },
    });

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// Close job and reject all remaining applicants
export const closeJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);

    await prisma.application.updateMany({
      where: { jobId, status: "pending" },
      data: { status: "rejected" },
    });

    res.json({ message: "Job closed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// tambah ke transaction
export const completeProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.job.findUnique({
      where: { id: parseInt(projectId) },
      include: { company: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Update status jadi COMPLETED
    const closedProject = await prisma.job.update({
      where: { id: parseInt(projectId) },
      data: { status: "COMPLETED" },
    });

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // CASE 1: JOB (company bayar freelancer)
    if (project.type === "JOB" && project.hiredFreelancerId && project.paymentAmount) {
      await prisma.transaction.createMany({
        data: [
          {
            userId: project.hiredFreelancerId,
            type: "REVENUE",
            amount: project.paymentAmount,
            month,
            year,
          },
          {
            userId: project.companyId,
            type: "EXPENSE",
            amount: project.paymentAmount,
            month,
            year,
          },
        ],
      });
    }

    // CASE 2: COURSE (freelancer bayar company)
    if (project.type === "COURSE" && project.paymentAmount) {
      await prisma.transaction.createMany({
        data: [
          {
            userId: project.companyId,
            type: "REVENUE",
            amount: project.paymentAmount,
            month,
            year,
          },
          {
            userId: project.hiredFreelancerId,
            type: "EXPENSE",
            amount: project.paymentAmount,
            month,
            year,
          },
        ],
      });
    }

    res.json({ message: "Project completed and financials recorded", closedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete project" });
  }
};

// Approve freelancer for a job
export const approveFreelancer = async (req, res) => {
  try {
    const { jobId, freelancerId, paymentAmount } = req.body;

    // Set hired freelancer
    await prisma.job.update({
      where: { id: parseInt(jobId) },
      data: {
        hiredFreelancerId: parseInt(freelancerId),
        paymentAmount: paymentAmount || 0,
        status: "ONGOING",
      },
    });

    // Approve selected application
    await prisma.application.updateMany({
      where: { jobId: parseInt(jobId), freelancerId: parseInt(freelancerId) },
      data: { status: "approved" },
    });

    // Reject others
    await prisma.application.updateMany({
      where: {
        jobId: parseInt(jobId),
        freelancerId: { not: parseInt(freelancerId) },
      },
      data: { status: "rejected" },
    });

    res.json({ message: "Freelancer approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject freelancer manually
export const rejectFreelancer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status: "rejected" },
    });

    res.json({ message: "Freelancer rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===================== FREELANCER ===================== */

// Apply to a job/course
export const applyToProject = async (req, res) => {
  try {
    const { jobId, freelancerId } = req.body;

    // Cegah duplikasi
    const existing = await prisma.application.findFirst({
      where: { jobId: parseInt(jobId), freelancerId: parseInt(freelancerId) },
    });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const app = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        freelancerId: parseInt(freelancerId),
      },
    });

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unapply (cancel application)
export const unapplyProject = async (req, res) => {
  try {
    const { applicationId } = req.params;
    await prisma.application.delete({ where: { id: parseInt(applicationId) } });
    res.json({ message: "Unapplied successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applied projects
export const getFreelancerProjects = async (req, res) => {
  try {
    const freelancerId = parseInt(req.params.freelancerId);

    const applications = await prisma.application.findMany({
      where: { freelancerId },
      include: {
        job: {
          include: { company: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get projects currently working on or completed
export const getFreelancerWork = async (req, res) => {
  try {
    const freelancerId = parseInt(req.params.freelancerId);
    const projects = await prisma.job.findMany({
      where: {
        hiredFreelancerId: freelancerId,
        status: { in: ["ONGOING"] },
      },
      include: { company: true },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===================== CHARTS ===================== */

export const getFinancialStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await prisma.transaction.groupBy({
      by: ["month", "year", "type"],
      where: { userId: parseInt(userId) },
      _sum: { amount: true },
      orderBy: { year: "asc" },
    });

    // Format output biar rapi per bulan
    const stats = {};
    for (const t of transactions) {
      const key = `${t.month}-${t.year}`;
      if (!stats[key]) stats[key] = { revenue: 0, expense: 0 };
      if (t.type === "REVENUE") stats[key].revenue = t._sum.amount || 0;
      else stats[key].expense = t._sum.amount || 0;
    }

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch financial data" });
  }
};
