"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  compareAt: "",
  image: "/products/",
  category: "Mouse Pads",
  stock: "10",
  featured: true,
};

export function ProductManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function startAdd() {
    setMode("add");
    setEditId(null);
    setForm(emptyForm);
  }

  function startEdit(product: Product) {
    setMode("edit");
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      compareAt: product.compareAt ? String(product.compareAt) : "",
      image: product.image,
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
    });
  }

  function cancel() {
    setMode(null);
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      image: form.image,
      category: form.category,
      stock: parseInt(form.stock, 10),
      featured: form.featured,
    };

    const res =
      mode === "edit" && editId
        ? await fetch(`/api/admin/products/${editId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

    setLoading(false);
    if (res.ok) {
      cancel();
      router.refresh();
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <Button onClick={startAdd} size="sm">
        <Plus className="h-4 w-4 mr-1" /> Add Product
      </Button>

      {mode && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 border border-[var(--color-border)] p-6 grid sm:grid-cols-2 gap-4 bg-[var(--color-surface-elevated)]"
        >
          <p className="sm:col-span-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {mode === "edit" ? "Edit Product" : "New Product"}
          </p>
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Category (e.g. Mouse Pads, Hand Sleeves, Mouse Skates)"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <Input
            label="Price (Taka)"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="Compare At / Sale Price (optional)"
            type="number"
            step="0.01"
            value={form.compareAt}
            onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
          />
          <Input
            label="Stock"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            label="Image path or URL (e.g. /products/my-image.png)"
            required
            className="sm:col-span-2"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Show on homepage
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Product"}
            </Button>
            <Button type="button" variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-10 border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-[var(--color-muted)]">{p.category}</td>
                <td className="p-3">{formatCurrency(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-[var(--color-muted)] hover:text-white"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id, p.name)}
                      className="text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-[var(--color-muted)]">No products yet.</p>
        )}
      </div>
    </div>
  );
}
