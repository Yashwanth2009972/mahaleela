"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Star, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageDeviceUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
  aspectHint?: string;
}

export const ImageDeviceUpload: React.FC<ImageDeviceUploadProps> = ({
  images,
  onChange,
  multiple = true,
  label = "UPLOAD PHOTOS FROM DEVICE",
  aspectHint = "SUPPORTS ALL FORMATS • UP TO 24K ULTRA-HIGH FIDELITY",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage("");

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to upload one or more files.");
      }
    }

    if (uploadedUrls.length > 0) {
      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange([uploadedUrls[0]]);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([item, ...filtered]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] uppercase tracking-luxury text-gold font-medium">
          {label}
        </label>
        <span className="text-[9px] uppercase tracking-wider text-gold/60">
          {aspectHint}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*,.heic,.heif,.raw,.tiff,.svg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gold/40 hover:border-gold bg-cream/40 p-6 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-2"
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <span className="text-xs uppercase tracking-luxury text-gold font-medium">
              UPLOADING HIGH-FIDELITY ASSETS FROM DEVICE...
            </span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 border border-gold/40 bg-black flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5 text-gold" />
            </div>
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold pt-1">
              CLICK OR DRAG & DROP PHOTOS DIRECTLY FROM DEVICE
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gold/70">
              NO URLS REQUIRED • JPEG, PNG, WEBP, AVIF, HEIC, TIFF • UP TO 24K RESOLUTION
            </p>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 border border-red-500/60 bg-red-950/30 text-red-300 text-xs uppercase tracking-wider">
          {errorMessage}
        </div>
      )}

      {/* Image Thumbnails Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square border border-gold/40 bg-black group overflow-hidden"
            >
              <img
                src={url}
                alt={`Asset ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-gold text-black text-[8px] font-bold px-1.5 py-0.5 tracking-wider uppercase z-10">
                  PRIMARY
                </span>
              )}

              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAsPrimary(idx);
                    }}
                    title="Set as Primary Cover"
                    className="p-1.5 bg-gold text-black hover:scale-110 transition-transform"
                  >
                    <Star className="w-3.5 h-3.5 fill-black" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  title="Remove Asset"
                  className="p-1.5 bg-red-800 text-white hover:scale-110 transition-transform"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
