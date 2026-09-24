"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

export function ShopFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const activeCategory = searchParams.get("category");

  function setCategory(cat: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`px-4 py-2 text-xs uppercase tracking-wider border transition ${
            !activeCategory
              ? "bg-white text-black border-white"
              : "border-[var(--color-border)] hover:border-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition ${
              activeCategory === cat
                ? "bg-white text-black border-white"
                : "border-[var(--color-border)] hover:border-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
        <Input
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[200px]"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
    </div>
  );
}
