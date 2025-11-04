import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// 🔧 Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📦 Konfigurasi multer (penyimpanan lokal sementara)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const uploadMiddleware = multer({ storage }).single("file");

// 🚀 Controller utama untuk upload
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let finalUrl = "";
    let uploadedTo = "";

    // Upload ke Cloudinary dulu
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "connectify/uploads",
      });

      finalUrl = result.secure_url;
      uploadedTo = "cloudinary";

      // Hapus file lokal setelah berhasil upload
      fs.unlinkSync(file.path);
    } catch (cloudErr) {
      console.warn("⚠️ Cloudinary upload failed, using local fallback:", cloudErr.message);

      // Gunakan file lokal sebagai fallback
      finalUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      uploadedTo = "local";
    }

    res.status(200).json({
      message: "File uploaded successfully",
      url: finalUrl,
      uploadedTo,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
};
