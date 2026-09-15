"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Copy, Check, Trash2, Search, HardDrive } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  createdAt: Date;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

export const MediaLibraryClient: React.FC<MediaLibraryProps> = ({ initialMedia }) => {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.media) {
        setMediaList((prev) => [data.media, ...prev]);
        router.refresh();
      }
    } catch {
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload and Search Bar */}
      <div className="border border-gold/30 bg-white p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH ASSETS BY FILENAME..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-cream/30 border border-gold text-xs uppercase tracking-wider text-gold focus:outline-none"
          />
        </div>

        <label className="px-6 py-2.5 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-medium cursor-pointer inline-flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "UPLOADING ASSET..." : "UPLOAD NEW MEDIA"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="border border-gold/30 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-gold/20 mb-6">
          <span className="font-serif text-sm uppercase tracking-luxury text-gold font-medium">
            ATELIER MEDIA ASSETS ({filtered.length})
          </span>
          <span className="text-[10px] uppercase tracking-wide text-gold/60">
            OFFICIAL LOGO & PRODUCT PHOTOGRAPHY
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group border border-gold/30 bg-cream flex flex-col justify-between overflow-hidden hover:border-gold transition-all"
              >
                <div className="relative w-full aspect-square bg-white border-b border-gold/20 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-gold font-medium truncate" title={item.filename}>
                    {item.filename}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.id, item.url)}
                      className="w-full py-1.5 border border-gold/40 bg-white text-gold text-[9px] uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-cream border border-gold/20 max-w-sm mx-auto">
            <HardDrive className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-xs uppercase tracking-luxury text-gold/80">
              NO ASSETS MATCHING SEARCH
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
