import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const getTopFreelancers = async (req, res) => {
  try {
    const { category, viewAll } = req.query;

    const limit = viewAll === "true" ? undefined : 15;

    const workers = await prisma.user.findMany({
      where: {
        role: "FREELANCER",
        ...(category ? { specialty: category } : {}),
      },
      orderBy: { rating: "desc" },
      take: limit,
    });

    res.status(200).json(workers);
  } catch (err) {
    console.error("Get top workers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
