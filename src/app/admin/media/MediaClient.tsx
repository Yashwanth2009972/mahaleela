"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Plus, ShieldCheck } from "lucide-react";

export function MediaClient({ initialMedia }: { initialMedia: any[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState(initialMedia);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newFilename, setNewFilename] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setIsRegistering(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: newFilename || "media-asset",
          url: newUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMediaList([data.media, ...mediaList]);
        setNewUrl("");
        setNewFilename("");
        router.refresh();
      }
    } catch {} finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Register Asset Box */}
      <div className="border border-gold/30 bg-cream p-6 shadow-sm">
        <h2 className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold mb-3">
          REGISTER ASSET TO VAULT
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newFilename}
            onChange={(e) => setNewFilename(e.target.value)}
            placeholder="ASSET NAME (E.G. CAMPAIGN_HERO_01)"
            className="sm:w-1/3 bg-white border border-gold/40 px-3 py-2 text-xs uppercase text-gold focus:outline-none focus:border-gold"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
            placeholder="IMAGE URL (/assets/... or https://...)"
            className="flex-1 bg-white border border-gold/40 px-3 py-2 text-xs text-gold focus:outline-none focus:border-gold font-mono"
          />
          <button
            type="submit"
            disabled={isRegistering}
            className="px-6 py-2 border border-gold bg-gold text-white text-xs uppercase tracking-luxury hover:bg-white hover:text-gold transition-colors font-bold"
          >
            {isRegistering ? "REGISTERING..." : "REGISTER ASSET"}
          </button>
        </form>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.map((m) => {
          const isOfficialLogo = m.filename === "mahaleela-logo.jpg";
          return (
            <div key={m.id} className="border border-gold/30 bg-white p-3 flex flex-col justify-between group">
              <div className="aspect-square bg-cream border border-gold/20 overflow-hidden flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt || m.filename} className="w-full h-full object-contain p-1" />
                {isOfficialLogo && (
                  <div className="absolute top-1 left-1 bg-gold text-white px-1 py-0.5 text-[7px] uppercase tracking-wider flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>PROTECTED</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-luxury text-gold font-bold truncate">
                  {m.filename}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(m.url)}
                  className="w-full mt-2 py-1 border border-gold/30 text-[9px] uppercase tracking-luxury text-gold hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  {copiedUrl === m.url ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === m.url ? "COPIED" : "COPY URL"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
