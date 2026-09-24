import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categoryList = categories.map((c) => c.category);

  const products = await prisma.product.findMany({
    where: {
      ...(params.category ? { category: params.category } : {}),
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { description: { contains: params.q } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-trizen py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-wide">Shop</h1>
        <p className="text-[var(--color-muted)] mt-2">
          {products.length} products available
        </p>
      </div>

      <ShopFilters categories={categoryList} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-[var(--color-muted)] py-20">
          No products found. Try a different search or category.
        </p>
      )}
    </div>
  );
}
