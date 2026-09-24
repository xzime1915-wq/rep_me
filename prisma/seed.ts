import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "TriZen TriPad V1 Black",
    slug: "trizen-tripad-v1-black",
    description:
      "Premium glass mouse pad built for competitive esports. The TriPad V1 Black features an ultra-smooth tempered glass surface for super-fast glide — perfect for precision flicks, tracking, and low-friction aim. Engineered for ultimate esports performance with a sleek matte black finish and TriZen branding.",
    price: 99.99,
    compareAt: null,
    image: "/products/tripad-v1-black.png",
    category: "Mouse Pads",
    stock: 50,
    featured: true,
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
    create: {
      tagline: "Premium Esports Gear",
      currency: "BDT",
    },
  });

  const hash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "TriZen@2026",
    12
  );
  await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@trizenstore.com",
      passwordHash: hash,
      name: "TriZen Admin",
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
