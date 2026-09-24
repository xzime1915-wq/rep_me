"use client";

import Link from "next/link";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-black/90 backdrop-blur-md">
      <div className="container-trizen flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <AnimatedLogo size="sm" />
          <span className="hidden sm:block text-sm font-semibold tracking-[0.25em] uppercase">
            TriZen Store
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide uppercase transition-colors hover:text-white",
                pathname === l.href ? "text-white" : "text-[var(--color-muted)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden md:flex p-2 text-[var(--color-muted)] hover:text-white"
            aria-label="Search shop"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative p-2 text-[var(--color-muted)] hover:text-white"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-sm bg-white text-[10px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[var(--color-border)] bg-black px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-wide border-b border-[var(--color-border)] last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
