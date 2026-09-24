import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductImage } from "@/components/ProductImage";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition hover:border-zinc-500"
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, 25vw"
          className="p-5 sm:p-8"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-semibold uppercase">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{formatCurrency(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs text-[var(--color-muted)] line-through">
              {formatCurrency(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
