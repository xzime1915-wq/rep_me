"use client";

import { Button } from "@/components/Button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function InvoiceActions() {
  const params = useParams();

  return (
    <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
      <Link href={`/admin/orders/${params.id}`}>
        <Button variant="secondary" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </Link>
      <Button size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-1" /> Print
      </Button>
    </div>
  );
}
