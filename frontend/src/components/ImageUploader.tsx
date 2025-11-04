"use client";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void; // callback jika berhasil upload
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Pilih gambar terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
        onUploadComplete?.(data.url);
      } else {
        alert("Upload gagal!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Label dan input file */}
      <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>

      <div className="flex items-center space-x-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-l-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-200 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-400 mt-2">JPG, PNG, atau JPEG hingga 10MB</p>
        </div>

        <button onClick={handleUpload} disabled={loading} className={`px-4 py-2 text-sm font-semibold rounded-md text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"}`}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Preview Gambar */}
      <div className="w-full mt-6 min-h-64 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden">
        <img src={preview || uploadedUrl || "/image-preview-default.png"} alt="Preview" className="object-cover w-full h-full" />
      </div>

      {uploadedUrl && (
        <p className="text-xs text-green-600 mt-2 break-all">
          URL:{" "}
          <a href={uploadedUrl} target="_blank" className="underline">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  );
}
