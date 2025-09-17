import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Create default categories
  const categories = [
    { name: "Plástico", icon: "plastic" },
    { name: "Papel", icon: "paper" },
    { name: "Vidro", icon: "glass" },
    { name: "Metal", icon: "metal" },
    { name: "Eletrônicos", icon: "electronics" },
    { name: "Orgânico", icon: "organic" },
  ];
  for (const c of categories) {
    await prisma.materialCategory.upsert({
      where: { name: c.name },
      create: c,
      update: c,
    });
  }

  // Create an admin test user
  const email = "admin@reuse.local";
  const passwordHash = await argon2.hash("admin123");
  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash, name: "Admin" },
    update: {},
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
