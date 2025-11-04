import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getHeroProject = async (req, res) => {
  try {
    const heroProject = await prisma.job.findFirst({
      where: { status: "ONGOING" },
      orderBy: { contractDeadline: "asc" },
      include: { company: true }, // include company info jika perlu
    });

    res.json(heroProject || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hero project" });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const activeProjectsCount = await prisma.job.count({
      where: { status: "ONGOING" },
    });

    const pendingApplicationsCount = await prisma.application.count({
      where: { status: "PENDING" },
    });

    const upcomingPaymentsSumObj = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: { in: ["POTENTIAL", "PENDING"] } },
    });

    const upcomingPaymentsSum = upcomingPaymentsSumObj._sum.amount ?? 0;

    res.json({
      activeProjects: activeProjectsCount,
      pendingApplications: pendingApplicationsCount,
      upcomingPayments: upcomingPaymentsSum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary cards" });
  }
};

export const getTopFreelancers = async (req, res) => {
  try {
    const topFreelancers = await prisma.freelancer.findMany({
      orderBy: [{ totalJobs: "desc" }, { rating: "desc" }],
      take: 6,
    });

    res.json(topFreelancers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch top freelancers" });
  }
};

export const getTopJobs = async (req, res) => {
  try {
    const topJobs = await prisma.job.findMany({
      orderBy: { paymentAmount: "desc" },
      take: 6,
      include: { company: true },
    });

    res.json(topJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch top jobs" });
  }
};
