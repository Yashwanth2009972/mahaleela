const { execSync } = require("child_process");

console.log("==========================================");
console.log("MAHALEELA PRODUCTION DEPLOYMENT INITIALIZER");
console.log("==========================================");

if (process.env.DATABASE_URL) {
  try {
    console.log("Applying PostgreSQL database migrations...");
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("Migrations applied successfully.");

    console.log("Seeding default categories and admin user...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("Database seeded successfully.");
  } catch (err) {
    console.warn("Database initialization notice (will continue build):", err.message);
  }
} else {
  console.warn("DATABASE_URL not set during build phase; database will be accessed at runtime.");
}

console.log("Compiling Next.js application...");
execSync("npx next build", { stdio: "inherit" });