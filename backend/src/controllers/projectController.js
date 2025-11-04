import { PrismaClient } from "../../generated/prisma/index.js";
import { v2 as cloudinary } from "cloudinary";
import cron from "node-cron";
const prisma = new PrismaClient();

cron.schedule("0 0 * * *", async () => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "CLOSED" },
    });

    for (const job of jobs) {
      if (!job.paymentAmount) {
        await prisma.job.update({
          where: { id: job.id },
          data: { status: "OPEN" },
        });
        console.log(`Job ${job.id} reopened because no paymentAmount set.`);
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

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
          applications: {
            include: {
              freelancer: true,
            },
          },
        },
      });
    } else if (type === "COURSE") {
      data = await prisma.course.findUnique({
        where: { id: Number(jobId) },
        include: {
          company: true,
          applications: {
            include: {
              freelancer: true,
            },
          },
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

export const updateProjectInfo = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, specialty, minSalary, maxSalary, image, location, applicationDeadline, contractDeadline } = req.body;

    const job = await prisma.job.findUnique({ where: { id: parseInt(projectId) } });
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status !== "OPEN") {
      return res.status(400).json({ message: "Can only edit job while status is OPEN" });
    }

    const updated = await prisma.job.update({
      where: { id: job.id },
      data: {
        title,
        description,
        specialty,
        minSalary,
        maxSalary,
        image,
        location,
        applicationDeadline: new Date(applicationDeadline),
        contractDeadline: new Date(contractDeadline),
      },
    });

    res.json({ message: "Job info updated successfully", job: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job info" });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, paymentAmount, hiredFreelancerId } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(projectId) },
      include: { applications: true },
    });
    if (!job) return res.status(404).json({ message: "Job not found" });

    let updateData = {};
    let transactions = [];

    switch (status) {
      case "CLOSED":
        if (!hiredFreelancerId) return res.status(400).json({ message: "You must select a freelancer to close the job" });

        // Update semua application: hanya satu approved
        await prisma.application.updateMany({
          where: { jobId: job.id, freelancerId: { not: parseInt(hiredFreelancerId) } },
          data: { status: "rejected" },
        });

        await prisma.application.updateMany({
          where: { jobId: job.id, freelancerId: parseInt(hiredFreelancerId) },
          data: { status: "approved" },
        });

        updateData = { hiredFreelancerId: parseInt(hiredFreelancerId), status: "CLOSED" };
        break;

      case "ONGOING":
        if (!job.hiredFreelancerId) return res.status(400).json({ message: "No freelancer has been approved yet" });

        if (!paymentAmount) return res.status(400).json({ message: "Payment amount is required" });

        if (paymentAmount < job.minSalary || paymentAmount > job.maxSalary) return res.status(400).json({ message: "Payment must be within salary range" });

        updateData = { paymentAmount, status: "ONGOING" };
        break;

      case "COMPLETED":
        if (job.status !== "ONGOING") return res.status(400).json({ message: "Job must be ongoing first" });

        const now = new Date();
        transactions = [
          {
            userId: job.hiredFreelancerId,
            type: "REVENUE",
            amount: job.paymentAmount,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          },
          {
            userId: job.companyId,
            type: "EXPENSE",
            amount: job.paymentAmount,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          },
        ];

        updateData = { status: "COMPLETED" };
        break;

      default:
        return res.status(400).json({ message: "Invalid status" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: job.id },
      data: updateData,
    });

    if (transactions.length > 0) await prisma.transaction.createMany({ data: transactions });

    res.json({ message: "Job status updated successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job status" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { projectId } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(projectId) },
      include: { applications: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status !== "OPEN") {
      return res.status(400).json({ message: "Only OPEN jobs can be deleted" });
    }

    // Hapus semua aplikasi terkait job ini
    await prisma.application.deleteMany({
      where: { jobId: job.id },
    });

    // Hapus job
    await prisma.job.delete({
      where: { id: job.id },
    });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Failed to delete job" });
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
export const applyJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const freelancerId = req.user.id;

    // Pastikan job masih open
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "OPEN") {
      return res.status(400).json({ message: "Cannot apply — job is not open" });
    }

    // Cegah apply dua kali
    const existing = await prisma.application.findFirst({
      where: { jobId, freelancerId },
    });

    if (existing) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Buat aplikasi baru
    const newApp = await prisma.application.create({
      data: {
        jobId,
        freelancerId,
        status: "pending",
      },
    });

    res.status(201).json({ message: "Applied successfully", application: newApp });
  } catch (error) {
    console.error("Error applying job:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

export const getFreelancerApplicationByJobId = async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const freelancerId = req.user.id;

    const application = await prisma.application.findFirst({
      where: { jobId, freelancerId },
      include: {
        job: {
          include: {
            company: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found for this job" });
    }

    res.json(application);
  } catch (error) {
    console.error("Error fetching freelancer application by jobId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Unapply (hapus lamaran)
export const unapplyFreelancerJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const freelancerId = req.user.id;

    const existingApp = await prisma.application.findFirst({
      where: { jobId, freelancerId },
    });

    if (!existingApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    await prisma.application.delete({
      where: { id: existingApp.id },
    });

    res.json({ message: "Application removed successfully" });
  } catch (error) {
    console.error("Error unapplying job:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
