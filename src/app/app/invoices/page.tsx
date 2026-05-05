"use client";

import Link from "next/link";
import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { InvoiceRows, PageHeaderActions } from "@/components/workflow";
import { Badge, Button } from "@/components/ui";
import { DatePickerField, FilterBar, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { useI18n } from "@/lib/i18n";

export default function InvoicesPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("invoices")} subtitle={t("createSendTrack")} button={t("createInvoice")} />
      <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <TextField label={t("search")} placeholder="Invoice or customer" onInput={(event) => setQuery(event.currentTarget.value)} />
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
    </div>
  );
}
