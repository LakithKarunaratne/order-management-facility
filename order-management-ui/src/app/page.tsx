import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="w-full max-w-md px-6 py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-2xl font-semibold">Order Management</h1>
          <p className="text-sm text-muted-foreground">
            Simple mobile-first UI
          </p>

          <div className="mt-8 w-full flex flex-col gap-4">
            <Button asChild size="lg" className="rounded-2xl text-lg h-14">
              <Link href="/products">Products</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl text-lg h-14 border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/orders">Orders</Link>
            </Button>
          </div>

          <div className="mt-12 w-full">
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
      </main>
    </div>
  );
}
