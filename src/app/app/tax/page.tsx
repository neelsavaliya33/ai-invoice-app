"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, GstCards } from "@/components/accounting-workflow";
import { Card, DataTable } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function TaxPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState("All statuses");
  const checklist = [
    ["Reconcile sales invoices", "Apr 2026", "Priya", "Ready"],
    ["Verify input GST", "Apr 2026", "Priya", "Review"],
    ["Prepare GSTR-1", "Apr 2026", "Owner", "Ready"],
    ["Prepare GSTR-3B", "Apr 2026", "Owner", "Pending"],
  ].filter((row) => status === "All statuses" || row[3] === status);
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="taxGst" subtitleKey="taxSubtitle" action={t("prepareReturn")} />
      <GstCards />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">{t("gstFilingChecklist")}</h2>
          <DataTable
            headers={[t("task"), t("period"), t("owner"), t("status")]}
            rows={checklist}
          />
        </Card>
        <AccountingAiCard text="Net GST payable is INR 84,200. Input credit looks healthy, but verify two packaging expenses before filing GSTR-3B." />
      </div>
    </div>
  );
}
