"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, X, Upload, CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface EvidenceUploaderProps {
  onUploadComplete: (url: string, type: string) => void;
  files: { url: string; type: string }[];
  onRemove: (url: string) => void;
}

export function EvidenceUploader({ onUploadComplete, files, onRemove }: EvidenceUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Cloudinary Signed Upload would be better, but for this demo
    // we use an unsigned upload or a simulated one if credentials aren't set.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Placeholder

    try {
      // In a real scenario, we'd use the Cloudinary API
      // Since we don't have real creds, we'll simulate the response
      // But I will provide the real code structure

      /*
      const res = await fetch(\`https://api.cloudinary.com/v1_1/\${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload\`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      onUploadComplete(data.secure_url, "image");
      */

      // Simulated upload for verification
      setTimeout(() => {
        onUploadComplete(URL.createObjectURL(file), "image");
        setIsUploading(false);
      }, 1500);

    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted block">Evidence & Artifacts</label>

      <div className="flex flex-wrap gap-4">
        {files.map((file) => (
          <div key={file.url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
            <img src={file.url} alt="Evidence" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(file.url)}
              className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        <label className="w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 hover:border-accent-purple/50 transition-all cursor-pointer bg-white/5">
          {isUploading ? (
            <Spinner />
          ) : (
            <>
              <Upload className="w-5 h-5 text-text-muted" />
              <span className="text-[10px] text-text-muted mt-1">Upload</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
        </label>
      </div>
    </div>
  );
}
