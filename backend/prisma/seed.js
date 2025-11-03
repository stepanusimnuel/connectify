import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Bersihkan semua data lama
  await prisma.transaction.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // --- Buat beberapa company
  const companiesData = [
    { name: "Techify Solutions", email: "techify@example.com", specialty: "Software Development", location: "Jakarta" },
    { name: "Creative Studio", email: "creative@example.com", specialty: "Design", location: "Bandung" },
    { name: "AI Innovators", email: "ai@example.com", specialty: "AI & ML", location: "Jakarta" },
    { name: "EduTech Labs", email: "edutech@example.com", specialty: "Education Tech", location: "Yogyakarta" },
  ];
  await prisma.user.createMany({
    data: companiesData.map((c) => ({
      ...c,
      password: hashedPassword,
      role: "COMPANY",
      description: `Company ${c.name} description`,
      profilePic: null,
      priceStart: null,
      rating: null,
      totalJobs: Math.floor(Math.random() * 5) + 1,
    })),
  });

  // --- Buat beberapa freelancer
  const freelancersData = [
    { name: "Alice Johnson", email: "alice@example.com", specialty: "Full-stack Web Dev", location: "Yogyakarta", priceStart: 200000 },
    { name: "Bob Tan", email: "bob@example.com", specialty: "UI/UX Design", location: "Bandung", priceStart: 150000 },
    { name: "Cindy Lee", email: "cindy@example.com", specialty: "Mobile Development", location: "Jakarta", priceStart: 180000 },
    { name: "David Kim", email: "david@example.com", specialty: "Frontend Developer", location: "Semarang", priceStart: 220000 },
    { name: "Eva Chen", email: "eva@example.com", specialty: "Backend Developer", location: "Malang", priceStart: 250000 },
  ];
  await prisma.user.createMany({
    data: freelancersData.map((f) => ({
      ...f,
      password: hashedPassword,
      role: "FREELANCER",
      description: `Freelancer ${f.name} description`,
      profilePic: null,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
      totalJobs: Math.floor(Math.random() * 10),
    })),
  });

  // --- Ambil semua user
  const companies = await prisma.user.findMany({ where: { role: "COMPANY" } });
  const freelancers = await prisma.user.findMany({ where: { role: "FREELANCER" } });

  // --- Buat banyak job/course
  const jobsData = [];
  for (let i = 1; i <= 20; i++) {
    const isCourse = Math.random() < 0.5;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const createdAt = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const contractDeadline = new Date(createdAt);
    contractDeadline.setMonth(contractDeadline.getMonth() + Math.floor(Math.random() * 6) + 1);
    const minSalary = isCourse ? 0 : Math.floor(Math.random() * 3000000) + 500000;
    const maxSalary = isCourse ? 0 : minSalary + Math.floor(Math.random() * 5000000);
    const paymentAmount = isCourse ? Math.floor(Math.random() * 500000) + 50000 : Math.floor(Math.random() * 8000000) + 500000;

    jobsData.push({
      title: `${isCourse ? "Course" : "Job"} ${i}`,
      description: `Description for ${isCourse ? "course" : "job"} ${i}`,
      specialty: freelancers[Math.floor(Math.random() * freelancers.length)].specialty,
      minSalary,
      maxSalary,
      location: isCourse ? "Online" : ["Jakarta", "Bandung", "Surabaya"][Math.floor(Math.random() * 3)],
      image: null,
      applicationDeadline: createdAt,
      contractDeadline,
      companyId: company.id,
      status: ["OPEN", "CLOSED", "ONGOING", "COMPLETED"][Math.floor(Math.random() * 4)],
      type: isCourse ? "COURSE" : "JOB",
      paymentAmount,
      hiredFreelancerId: isCourse ? null : Math.random() < 0.7 ? freelancers[Math.floor(Math.random() * freelancers.length)].id : null,
      createdAt,
    });
  }

  const createdJobs = [];
  for (const j of jobsData) {
    const job = await prisma.job.create({ data: j });
    createdJobs.push(job);
  }

  // --- Buat applications secara acak
  const applicationsData = [];
  for (const job of createdJobs) {
    const nApplicants = Math.floor(Math.random() * freelancers.length) + 1;
    const shuffledFreelancers = [...freelancers].sort(() => 0.5 - Math.random());
    for (let i = 0; i < nApplicants; i++) {
      applicationsData.push({
        jobId: job.id,
        freelancerId: shuffledFreelancers[i].id,
        status: ["pending", "approved", "rejected"][Math.floor(Math.random() * 3)],
      });
    }
  }
  await prisma.application.createMany({ data: applicationsData });

  // --- Seeder Transaction
  const transactionsData = [];
  for (const job of createdJobs) {
    const month = job.createdAt.getMonth() + 1;
    const year = job.createdAt.getFullYear();

    if (job.type === "COURSE") {
      // Revenue untuk company
      transactionsData.push({
        userId: job.companyId,
        type: "REVENUE",
        amount: job.paymentAmount || 0,
        month,
        year,
      });
    }
    if (job.hiredFreelancerId && job.paymentAmount) {
      // Expense untuk freelancer
      transactionsData.push({
        userId: job.hiredFreelancerId,
        type: "EXPENSE",
        amount: job.paymentAmount,
        month,
        year,
      });
    }
  }

  await prisma.transaction.createMany({ data: transactionsData });

  console.log("Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
