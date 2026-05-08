"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Clock3, Filter, Plus, ReceiptText, WalletCards } from "lucide-react";
import { InvoiceRows, PageHeaderActions } from "@/components/workflow";
import { Badge, Button, Card } from "@/components/ui";
import { DatePickerField, FilterBar, FormModal, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { useI18n } from "@/lib/i18n";
import { invoices } from "@/lib/data";
import { currency } from "@/lib/utils";
import { InvoiceDocumentForm } from "@/components/workflow-actions";

export default function InvoicesPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(false);
  const receivables = invoices.reduce((total, invoice) => total + Math.max(0, invoice.amount - invoice.paid), 0);
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue").length;
  const draftValue = invoices.filter((invoice) => invoice.status === "Draft").reduce((total, invoice) => total + invoice.amount, 0);
  const gstCollected = invoices.reduce((total, invoice) => total + invoice.gst, 0);
  const summaryCards = [
    ["Open receivables", currency(receivables), "Customer amount still pending", WalletCards, receivables > 100000 ? "amber" : "green"],
    ["Overdue invoices", String(overdue), "Requires collection follow-up today", AlertTriangle, overdue ? "red" : "green"],
    ["Draft value", currency(draftValue), "Not posted to customer ledger yet", Clock3, draftValue ? "blue" : "default"],
    ["Output GST", currency(gstCollected), "Estimated tax from listed invoices", ReceiptText, "violet"],
  ] as const;
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("invoices")} subtitle="Create GST invoices, track payment collection, prepare dispatch details, and keep receivables under control." button={t("createInvoice")} onButtonClick={() => setOpen(true)} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(([label, value, helper, Icon, tone]) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-3 text-2xl font-black">{value}</p>
            <Badge className="mt-4" tone={tone as never}>{helper}</Badge>
          </Card>
        ))}
      </div>
      <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <TextField label={t("search")} placeholder="Invoice, customer, owner, or dispatch type" onInput={(event) => setQuery(event.currentTarget.value)} />
        <LookupSelectField label={t("status")} group="invoice-statuses" defaultValue="All" prependOptions={[{ label: "All", value: "All" }]} onChange={(event) => setStatus(event.currentTarget.value)} />
        <DatePickerField label={t("issueDate")} />
        <LookupSelectField label={t("taxType")} group="tax-types" defaultValue="GST" />
        <Button variant="secondary" className="self-end"><Filter className="h-4 w-4" /> {t("filters")}</Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Draft", "Sent", "Paid", "Overdue"].map((status) => <Badge key={status} tone={status === "Overdue" ? "red" : "default"}>{status}</Badge>)}
        </div>
      </FilterBar>
      <InvoiceRows query={query} status={status} />
      <div className="fixed bottom-6 right-6">
        <Link href="/app/invoices/new" className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-5 w-5" />
          {t("newInvoice")}
        </Link>
      </div>
      <FormModal open={open} onOpenChange={setOpen} title="Create billing document">
        <InvoiceDocumentForm onClose={() => setOpen(false)} />
      </FormModal>
    </div>
  );
}
