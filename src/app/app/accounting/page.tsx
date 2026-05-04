"use client";

import { AccountingAiCard, AccountingFilters, AccountingHeader, AccountingKpis, LedgerTable } from "@/components/accounting-workflow";
import { Card } from "@/components/ui";

export default function AccountingPage() {
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="accounting" subtitleKey="accountingSubtitle" action="Journal entry" />
      <AccountingKpis />
      <AccountingFilters />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">General ledger</h2>
          <LedgerTable />
        </Card>
        <AccountingAiCard text="Receivables are concentrated in Kavya Textiles and Prime Mobile. Review collection aging before creating new purchase commitments." />
      </div>
    </div>
  );
}
