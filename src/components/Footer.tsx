"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] mt-16">
      <div className="container-trizen py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="TriZen Store" width={36} height={36} />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              TriZen Store
            </span>
          </div>
          <p className="text-[var(--color-muted)] text-sm max-w-md leading-relaxed">
            Premium esports gear — mouse pads, hand sleeves, and mouse skates.
            Built for competitive play.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/shop" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Mouse Pads" className="hover:text-white">
                Mouse Pads
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Hand Sleeves" className="hover:text-white">
                Hand Sleeves
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Mouse Skates" className="hover:text-white">
                Mouse Skates
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest mb-4">
            Support
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} TriZen Store. All rights reserved.
      </div>
    </footer>
  );
}
