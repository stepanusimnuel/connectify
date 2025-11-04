import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 🔍 Cek apakah application ada
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { job: true },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Update application yang diklik
    const updatedApp = await prisma.application.update({
      where: { id: application.id },
      data: { status },
    });

    // Jika disetujui, tolak semua application lain di job yang sama
    if (status === "approved") {
      await prisma.application.updateMany({
        where: {
          jobId: application.jobId,
          id: { not: application.id },
        },
        data: { status: "rejected" },
      });

      // Update job → tandai freelancer & ubah status jadi CLOSED
      await prisma.job.update({
        where: { id: application.jobId },
        data: {
          hiredFreelancerId: application.freelancerId,
          status: "CLOSED",
        },
      });
    }

    res.json({ message: "Application status updated", application: updatedApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update application status" });
  }
};
