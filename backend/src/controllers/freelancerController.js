import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// ✅ Get all freelancers (with optional filter)
export const getAllFreelancers = async (req, res) => {
  try {
    const { category, search, minRating } = req.query;

    const where = {
      role: "FREELANCER",
      ...(category ? { specialty: { contains: category, mode: "insensitive" } } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(minRating ? { rating: { gte: parseFloat(minRating) } } : {}),
    };

    const freelancers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
        description: true,
        location: true,
        priceStart: true,
        rating: true,
        totalJobs: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    res.json(freelancers);
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.status(500).json({ error: "Failed to fetch freelancers" });
  }
};
