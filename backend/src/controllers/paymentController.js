import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });

    // Hitung total per status
    const totalPotential = transactions.filter((t) => t.status === "POTENTIAL").reduce((sum, t) => sum + t.amount, 0);

    const totalPending = transactions.filter((t) => t.status === "PENDING").reduce((sum, t) => sum + t.amount, 0);

    const totalSuccess = transactions.filter((t) => t.status === "SUCCESS").reduce((sum, t) => sum + t.amount, 0);

    res.json({
      totals: {
        potential: totalPotential,
        pending: totalPending,
        success: totalSuccess,
      },
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get payments" });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const payments = await prisma.transaction.findMany({
      where: {
        status: "SUCCESS",
        job: {
          type: "JOB",
        },
      },
      include: {
        job: true,
      },
    });

    console.log(payments);

    // Ambil transaksi yang relevan bagi user
    const transactions = payments
      .filter((p) => p.job?.hiredFreelancerId === userId || p.job?.companyId === userId)
      .map((p) => {
        const isFreelancer = p.job?.hiredFreelancerId === userId;
        const isCompany = p.job?.companyId === userId;

        return {
          month: p.createdAt.getMonth() + 1,
          year: p.createdAt.getFullYear(),
          type: isFreelancer ? "REVENUE" : "EXPENSE",
          amount: p.amount,
        };
      });

    console.log(payments.filter((p) => p.job?.hiredFreelancerId === userId || p.job?.companyId === userId));

    // Kelompokkan per bulan
    const grouped = {};
    transactions.forEach((t) => {
      const key = `${t.year}-${t.month}`;
      if (!grouped[key]) grouped[key] = { month: t.month, year: t.year, revenue: 0, expense: 0 };
      if (t.type === "REVENUE") grouped[key].revenue += t.amount;
      else grouped[key].expense += t.amount;
    });

    const result = Object.values(grouped).sort((a, b) => a.month - b.month);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment stats" });
  }
};
