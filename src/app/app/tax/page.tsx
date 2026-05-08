"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, GstCards } from "@/components/accounting-workflow";
import { Card, DataTable } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { FormModal } from "@/components/form-kit";
import { GstReturnForm, WorkflowActionMenu } from "@/components/workflow-actions";

export default function TaxPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState("All statuses");
  const [open, setOpen] = useState(false);
  const checklist = [
    ["Reconcile sales invoices", "Apr 2026", "Priya", "Ready"],
    ["Verify input GST", "Apr 2026", "Priya", "Review"],
    ["Prepare GSTR-1", "Apr 2026", "Owner", "Ready"],
    ["Prepare GSTR-3B", "Apr 2026", "Owner", "Pending"],
  ].filter((row) => status === "All statuses" || row[3] === status);
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="taxGst" subtitleKey="taxSubtitle" action={t("prepareReturn")} onActionClick={() => setOpen(true)} />
      <GstCards />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">{t("gstFilingChecklist")}</h2>
          <DataTable
            headers={[t("task"), t("period"), t("owner"), t("status"), "Actions"]}
            rows={checklist.map((row) => [
              ...row,
              <WorkflowActionMenu key={row[0]} label="GST task" recordLabel={row[0]} actions={["GST reconciliation", "Input GST review", "Export return summary", "Mark reviewed"]} />,
            ])}
          />
        </Card>
        <AccountingAiCard text="Net GST payable is INR 84,200. Input credit looks healthy, but verify two packaging expenses before filing GSTR-3B." />
      </div>
      <FormModal open={open} onOpenChange={setOpen} title="GST return action">
        <GstReturnForm onClose={() => setOpen(false)} />
      </FormModal>
    </div>
  );
}
