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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Product = { id: string; name: string };
type Order = { id: string; items: Product[]; status?: string };

export default function OrdersPage() {
  const BASE = "http://localhost:8080"; // TODO: needs to be fetched dynamically from util
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 4;
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [items, setItems] = useState<Product[]>([]);

  const [searchId, setSearchId] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<Order | null>(null);
  const [statusChoice, setStatusChoice] = useState("Pending");

  async function loadProducts() {
    try {
      const res = await fetch(`${BASE}/api/v1/products/?skip=0&limit=1000`);
      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data.map((p: any) => ({ id: String(p.id), name: p.name }))
        : [];
      setProducts(normalized);
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
  }

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const res = await fetch(
        `${BASE}/api/v1/order/?skip=${skip}&limit=${limit}`
      );
      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data.map((o: any) => ({
            id: String(o.id),
            status: o.status,
            items: Array.isArray(o.items)
              ? o.items.map((it: any) => {
                  if (it && it.name)
                    return { id: String(it.id), name: it.name };
                  if (it && it.prod_id)
                    return { id: String(it.prod_id), name: String(it.prod_id) };
                  return { id: String(it), name: String(it) };
                })
              : [],
          }))
        : [];
      setOrders(normalized);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [skip]);

  function addItem() {
    if (!selectedProduct) return;
    const p = products.find((x) => String(x.id) === String(selectedProduct));
    if (p) setItems((s) => [...s, { ...p, id: String(p.id) }]);
  }

  const handleCreateOrderOpenChange = (open: boolean) => {
    setShowNew(open);
    if (!open) {
      setItems([]);
      setSelectedProduct("");
    }
  };

  async function placeOrder() {
    try {
      await fetch(`${BASE}/api/v1/order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ prod_id: Number(i.id), qty_ordered: 1 })),
        }),
      });
      setShowNew(false);
      setItems([]);
      setSelectedProduct("");
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  }

  async function doSearch() {
    if (!searchId) return;
    try {
      const res = await fetch(
        `${BASE}/api/v1/order/${encodeURIComponent(searchId)}`
      );
      if (!res.ok) {
        setSearchResult(null);
      } else {
        const data = await res.json();
        const normalized = {
          id: String(data.id),
          status: data.status,
          items: Array.isArray(data.items)
            ? data.items.map((it: any) =>
                it && it.name
                  ? { id: String(it.id), name: it.name }
                  : it.prod_id
                  ? { id: String(it.prod_id), name: String(it.prod_id) }
                  : { id: String(it), name: String(it) }
              )
            : [],
        };
        setSearchResult(normalized);
        setStatusChoice(normalized?.status ?? "Pending");
        setShowSearch(true);
      }
    } catch (e) {
      console.error(e);
      setSearchResult(null);
    }
  }

  async function updateStatus() {
    if (!searchResult) return;
    try {
      await fetch(
        `${BASE}/api/v1/order/${encodeURIComponent(searchResult.id)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusChoice }),
        }
      );
      setShowSearch(false);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="w-full max-w-md px-6 py-8">
        <h2 className="text-xl font-semibold text-center mb-6">Orders</h2>

        <div className="flex flex-col gap-3">
          <Dialog open={showNew} onOpenChange={handleCreateOrderOpenChange}>
            <DialogTrigger asChild>
              <Button>New Order</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Product</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={addItem}
                      disabled={!selectedProduct}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Items to Order</Label>
                  <div className="rounded-md border p-2 min-h-25 space-y-2">
                    {items.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No items added
                      </div>
                    ) : (
                      items.map((it, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-secondary p-2 rounded-md"
                        >
                          {it.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleCreateOrderOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={placeOrder} disabled={items.length === 0}>
                    Place order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            <Input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Order ID"
              className="flex-1"
            />
            <Button onClick={doSearch}>Search</Button>
          </div>

          <div className="space-y-3 mt-4">
            {loadingOrders ? (
              <div className="text-center text-sm text-muted">Loading…</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-sm text-muted">No orders</div>
            ) : (
              orders.map((o) => (
                <Card key={o.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Order {o.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {o.status ?? "Unknown"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Items: {o.items?.map((i) => i.name).join(", ")}
                    </div>
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
              disabled={orders.length < limit}
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
        </div>

        <Dialog open={showSearch} onOpenChange={setShowSearch}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order {searchResult?.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm">
                Current Status:{" "}
                <span className="font-medium">
                  {searchResult?.status ?? "-"}
                </span>
              </div>
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={statusChoice} onValueChange={setStatusChoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowSearch(false)}>
                  Cancel
                </Button>
                <Button onClick={updateStatus}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
