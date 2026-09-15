"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const LogoutButton: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full py-2.5 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{loading ? "TERMINATING SESSION..." : "SIGN OUT OF ATELIER"}</span>
    </button>
  );
};
