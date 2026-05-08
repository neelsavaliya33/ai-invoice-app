"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, AccountingKpis, LedgerTable } from "@/components/accounting-workflow";
import { Card } from "@/components/ui";
import { FormModal } from "@/components/form-kit";
import { JournalEntryForm } from "@/components/workflow-actions";

export default function AccountingPage() {
  const [status, setStatus] = useState("All statuses");
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="accounting" subtitleKey="accountingSubtitle" action="Journal entry" onActionClick={() => setOpen(true)} />
      <AccountingKpis />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">General ledger</h2>
          <LedgerTable status={status} />
        </Card>
        <AccountingAiCard text="Receivables are concentrated in Kavya Textiles and Prime Mobile. Review collection aging before creating new purchase commitments." />
      </div>
      <FormModal open={open} onOpenChange={setOpen} title="Journal entry">
        <JournalEntryForm onClose={() => setOpen(false)} />
      </FormModal>
    </div>
  );
}
