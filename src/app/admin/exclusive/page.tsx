import { prisma } from "@/lib/prisma";
import { AdminExclusiveClient } from "./AdminExclusiveClient";

export const dynamic = "force-dynamic";

export default async function AdminExclusivePage() {
  const modeSetting = await prisma.siteSettings.findUnique({
    where: { key: "exclusive_eligibility_mode" },
  });

  const currentMode = modeSetting?.value || "LOGGED-IN";

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          SALON PRIVILEGES
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          EXCLUSIVE SALON MANAGEMENT
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          CONFIGURE MEMBERSHIP ELIGIBILITY CRITERIA, PRIVATE MESSAGING, AND SALON ACCESS CONTROLS.
        </p>
      </div>

      <AdminExclusiveClient currentMode={currentMode} />
    </div>
  );
}
