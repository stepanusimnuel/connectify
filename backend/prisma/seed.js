import { PrismaClient, Role, Location, JobStatus } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const company1 = await prisma.user.create({
    data: {
      name: "Techify Inc",
      email: "hr@techify.com",
      password: "$2b$10$DPxF3yGlGWU1fma6QBkbPe.Rx/G.t5b6zIjX/pOwYE.UnNUJige1O",
      role: Role.COMPANY,
      location: "Jakarta",
      description: "Innovative software solutions provider.",
      totalJobs: 9,
    },
  });

  const company2 = await prisma.user.create({
    data: {
      name: "DesignHaus",
      email: "contact@designhaus.com",
      password: "$2b$10$DPxF3yGlGWU1fma6QBkbPe.Rx/G.t5b6zIjX/pOwYE.UnNUJige1O",
      role: Role.COMPANY,
      location: "Bandung",
      description: "Creative design agency for UI/UX projects.",
      totalJobs: 5,
    },
  });

  // 2️⃣ Buat beberapa freelancer
  const freelancer1 = await prisma.user.create({
    data: {
      name: "Alya Putri",
      email: "alya@freelance.com",
      password: "$2b$10$DPxF3yGlGWU1fma6QBkbPe.Rx/G.t5b6zIjX/pOwYE.UnNUJige1O",
      role: Role.FREELANCER,
      location: "Yogyakarta",
      specialty: "UI/UX Design",
      description: "Creative designer with 3+ years of experience",
      priceStart: 300000,
      totalJobs: 12,
      rating: 4.8,
    },
  });

  const freelancer2 = await prisma.user.create({
    data: {
      name: "Rafi Maulana",
      email: "rafi@freelance.com",
      password: "$2b$10$DPxF3yGlGWU1fma6QBkbPe.Rx/G.t5b6zIjX/pOwYE.UnNUJige1O",
      role: Role.FREELANCER,
      location: "Bandung",
      specialty: "Fullstack Developer",
      description: "Builds scalable web applications using React and Node.js",
      priceStart: 500000,
      totalJobs: 20,
      rating: 4.9,
    },
  });

  // 3️⃣ Buat job posting
  const job1 = await prisma.job.create({
    data: {
      title: "Frontend Developer for Landing Page",
      description: "Build a responsive landing page using React and Tailwind.",
      role: "Frontend Developer",
      minSalary: 4000000,
      maxSalary: 6000000,
      location: Location.Jakarta,
      applicationDeadline: new Date("2025-12-01"),
      contractDeadline: new Date("2026-01-10"),
      companyId: company1.id,
      status: JobStatus.OPEN,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "UI/UX Designer for Mobile App",
      description: "Design user-friendly mobile app UI/UX for fintech product.",
      role: "UI/UX Designer",
      minSalary: 3000000,
      maxSalary: 5000000,
      location: Location.Bandung,
      applicationDeadline: new Date("2025-12-15"),
      contractDeadline: new Date("2026-01-31"),
      companyId: company2.id,
      status: JobStatus.OPEN,
    },
  });

  // 4️⃣ Tambahkan aplikasi dari freelancer
  await prisma.application.createMany({
    data: [
      {
        jobId: job1.id,
        freelancerId: freelancer2.id,
        status: "pending",
      },
      {
        jobId: job2.id,
        freelancerId: freelancer1.id,
        status: "approved",
      },
    ],
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
