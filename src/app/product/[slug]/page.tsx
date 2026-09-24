import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  return (
    <div className="container-trizen py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="relative aspect-square min-h-[320px] sm:min-h-[420px] border border-[var(--color-border)] bg-black">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="p-6 sm:p-10 md:p-12"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-semibold">
              {formatCurrency(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-lg text-[var(--color-muted)] line-through">
                {formatCurrency(product.compareAt)}
              </span>
            )}
          </div>
          <p className="text-[var(--color-muted)] leading-relaxed mb-8">
            {product.description}
          </p>
          <p className="text-sm mb-6">
            {product.stock > 0 ? (
              <span className="text-emerald-400">
                In stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-400">Out of stock</span>
            )}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
