import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MAHALEELA database...");

  const adminEmail = "leelambikamahadeva@gmail.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hash = await bcrypt.hash("182009", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hash,
        name: "MAHALEELA Owner",
        role: "ADMIN",
      },
    });
    console.log("Admin user created: " + adminEmail);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });
    console.log("Admin user confirmed: " + adminEmail);
  }

  const categories = [
    { name: "T SHIRTS", slug: "t-shirts" },
    { name: "SHIRTS", slug: "shirts" },
    { name: "SWEATSHIRTS", slug: "sweatshirts" },
    { name: "HOODIES", slug: "hoodies" },
    { name: "MUGS", slug: "mugs" },
    { name: "HEADCAPS", slug: "headcaps" },
    { name: "KEYCHAINS", slug: "keychains" },
    { name: "SUNGLASSES", slug: "sunglasses" },
    { name: "WATCHES", slug: "watches" },
    { name: "MOBILE COVERS", slug: "mobile-covers" },
    { name: "PHOTO FRAMES", slug: "photo-frames" },
    { name: "WALLETS", slug: "wallets" },
  ];

  let i = 0;
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        orderIndex: i,
        isPublished: true,
      },
    });
    i++;
  }
  console.log(categories.length + " categories seeded.");

  // Seed default site settings (no free shipping, location-based delivery)
  await prisma.siteSettings.upsert({
    where: { key: "announcement_text" },
    update: { value: "PAN-INDIA DISPATCH • DELIVERY CHARGES ACCORDING TO LOCATION" },
    create: { key: "announcement_text", value: "PAN-INDIA DISPATCH • DELIVERY CHARGES ACCORDING TO LOCATION" },
  });
  await prisma.siteSettings.upsert({
    where: { key: "announcement_link" },
    update: { value: "/#catalogue" },
    create: { key: "announcement_link", value: "/#catalogue" },
  });
  await prisma.siteSettings.upsert({
    where: { key: "announcement_enabled" },
    update: { value: "true" },
    create: { key: "announcement_enabled", value: "true" },
  });

  console.log("Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
