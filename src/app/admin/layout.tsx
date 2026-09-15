import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AdminPinLoginPage from "./login/page";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  // If not authenticated with Master PIN, lock screen to dedicated Master PIN Gate
  if (!admin) {
    return <AdminPinLoginPage />;
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Light Luxury Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gold/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm uppercase tracking-luxury text-gold font-semibold">
              MAHALEELA ATELIER CMS
            </span>
            <span className="text-xs uppercase tracking-luxury text-gold/60 hidden sm:inline">
              • INTEGRATED MAISON PLATFORM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 border border-gold/30 bg-cream text-xs uppercase tracking-luxury text-gold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-medium">{admin.role}</span>
              <span className="text-gold/60 hidden md:inline">({admin.email})</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1 border border-gold bg-white text-gold text-xs uppercase tracking-luxury hover:bg-gold hover:text-white transition-colors"
            >
              STOREFRONT
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-6 md:p-8 bg-white max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}