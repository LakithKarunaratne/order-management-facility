"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Product = { id: string; name: string; price?: number; stock?: number };

export default function ProductsPage() {
  const BASE = "http://localhost:8080"; // TODO: needs to be fetched dynamically from util
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 4;
  const [loading, setLoading] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE}/api/v1/products/?skip=${skip}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [skip]);

  async function submitNew(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch(`${BASE}/api/v1/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price || 0),
          stock_qty: Number(stock || 0),
        }),
      });
      setShowNew(false);
      setName("");
      setPrice("");
      setStock("");
      setSkip(0);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="w-full max-w-md px-6 py-8">
        <h2 className="text-xl font-semibold text-center mb-6">Products</h2>

        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6">New Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitNew} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Amount</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-sm text-muted">Loading…</div>
          ) : products.length === 0 ? (
            <div className="text-center text-sm text-muted">No products</div>
          ) : (
            products.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Stock: {p.stock ?? 0}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${p.price ?? "-"}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            onClick={() => setSkip(Math.max(0, skip - limit))}
            variant="outline"
            size="sm"
            disabled={skip === 0}
          >
            Prev
          </Button>
          <Button
            onClick={() => setSkip(skip + limit)}
            variant="outline"
            size="sm"
            disabled={products.length < limit}
          >
            Next
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-2xl text-lg h-14 border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
