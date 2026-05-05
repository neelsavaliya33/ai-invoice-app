"use client";

import { InvoiceForm } from "@/components/workflow";
import { SectionTitle } from "@/components/ui";

export default function NewInvoicePage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="New invoice" subtitle="AI-assisted invoice creation with detailed GST, customer, payment, and preview workflow." />
      <InvoiceForm />
    </div>
  );
}
