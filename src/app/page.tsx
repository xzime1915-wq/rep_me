import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { HeroIntro } from "@/components/HeroIntro";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <HeroIntro />

      {products.length > 0 && (
        <section className="container-trizen py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide">Products</h2>
              <p className="text-[var(--color-muted)] text-sm mt-1">
                Esports gear built for winners
              </p>
            </div>
            <Link href="/shop" className="text-sm uppercase tracking-wider hover:underline">
              View All
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
