import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { InvoiceRows, PageHeaderActions } from "@/components/workflow";
import { Badge, Button } from "@/components/ui";
import { FilterBar, SelectField, TextField } from "@/components/form-kit";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeaderActions title="Invoices" subtitle="Create, send, track, and collect invoices." button="Create invoice" />
      <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <TextField label="Search" placeholder="Invoice or customer" />
        <SelectField label="Status" defaultValue="All" options={["All", "Draft", "Sent", "Paid", "Overdue"]} />
        <TextField label="Issue date" type="date" />
        <SelectField label="Tax type" defaultValue="GST" options={["GST", "IGST", "No tax"]} />
        <Button variant="secondary" className="self-end"><Filter className="h-4 w-4" /> Filters</Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Draft", "Sent", "Paid", "Overdue"].map((status) => <Badge key={status} tone={status === "Overdue" ? "red" : "default"}>{status}</Badge>)}
        </div>
      </FilterBar>
      <InvoiceRows />
      <div className="fixed bottom-6 right-6">
        <Link href="/app/invoices/new" className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-5 w-5" />
          New invoice
        </Link>
      </div>
    </div>
  );
}
