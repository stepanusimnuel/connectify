import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// GET /api/user/me
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        description: true,
        location: true,
        priceStart: true,
        profilePic: true,
        rating: true,
        specialty: true,
        totalJobs: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/me
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, description, location, priceStart, specialty, oldPassword, newPassword, confirmPassword } = req.body;

    // Ambil data user lama
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update password
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please fill all password fields" });
      }

      // Cek password lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      // Cek confirm password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirmation do not match" });
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    }

    // --- UPDATE FIELD PROFIL LAIN ---
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        description,
        location,
        priceStart: priceStart ? Number(priceStart) : undefined,
        specialty,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        description: true,
        location: true,
        priceStart: true,
        profilePic: true,
        rating: true,
        specialty: true,
        totalJobs: true,
      },
    });

    res.json({
      message: oldPassword && newPassword ? "Profile and password updated successfully" : "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
