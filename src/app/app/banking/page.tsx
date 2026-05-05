"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, BankTable } from "@/components/accounting-workflow";
import { Card } from "@/components/ui";

export default function BankingPage() {
  const [status, setStatus] = useState("All statuses");
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="banking" subtitleKey="bankingSubtitle" action="Import statement" />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">Bank reconciliation</h2>
          <BankTable status={status} />
        </Card>
        <AccountingAiCard text="Most bank transactions are reconciled. Review the cash deposit and attach the matching customer receipt before closing books." />
      </div>
    </div>
  );
}
