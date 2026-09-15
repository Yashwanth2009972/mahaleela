import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsRecords = await prisma.siteSettings.findMany();
  const settingsMap: { [key: string]: string } = {};
  for (const s of settingsRecords) {
    settingsMap[s.key] = s.value;
  }

  const auditLogs = await prisma.auditLog.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          PLATFORM GOVERNANCE
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          ATELIER CONFIGURATION & AUDIT
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          GOVERN BRAND IDENTITY, INDIA SHIPPING RULES, ATELIER POLICIES, AND AUDIT LOGS.
        </p>
      </div>

      <SettingsClient initialSettings={settingsMap} auditLogs={auditLogs} />
    </div>
  );
}
