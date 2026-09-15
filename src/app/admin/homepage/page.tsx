import { prisma } from "@/lib/prisma";
import { HomepageBuilderClient } from "./HomepageBuilderClient";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="border border-gold/30 bg-cream p-6 sm:p-8">
        <span className="text-[10px] tracking-ultra uppercase text-gold/70 font-serif block mb-1">
          STOREFRONT ARCHITECTURE
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gold uppercase tracking-luxury font-normal">
          CMS HOMEPAGE SECTION BUILDER
        </h1>
        <p className="text-xs uppercase tracking-luxury text-gold/80 mt-1 font-light">
          REORDER, EDIT HEADLINES, TOGGLE VISIBILITY, AND CUSTOMIZE ALL 15 STOREFRONT SECTIONS.
        </p>
      </div>

      <HomepageBuilderClient initialSections={sections} />
    </div>
  );
}
