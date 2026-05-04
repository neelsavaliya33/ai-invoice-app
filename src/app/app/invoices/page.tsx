"use client";

import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { InvoiceRows, PageHeaderActions } from "@/components/workflow";
import { Badge, Button } from "@/components/ui";
import { DatePickerField, FilterBar, SelectField, TextField } from "@/components/form-kit";
import { useI18n } from "@/lib/i18n";

export default function InvoicesPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("invoices")} subtitle={t("createSendTrack")} button={t("createInvoice")} />
      <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
        <TextField label={t("search")} placeholder="Invoice or customer" />
        <SelectField label={t("status")} defaultValue="All" options={["All", "Draft", "Sent", "Paid", "Overdue"]} />
        <DatePickerField label={t("issueDate")} />
        <SelectField label={t("taxType")} defaultValue="GST" options={["GST", "IGST", "No tax"]} />
        <Button variant="secondary" className="self-end"><Filter className="h-4 w-4" /> {t("filters")}</Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {["All", "Draft", "Sent", "Paid", "Overdue"].map((status) => <Badge key={status} tone={status === "Overdue" ? "red" : "default"}>{status}</Badge>)}
        </div>
      </FilterBar>
      <InvoiceRows />
      <div className="fixed bottom-6 right-6">
        <Link href="/app/invoices/new" className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-5 w-5" />
          {t("newInvoice")}
        </Link>
      </div>
    </div>
  );
}
