"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, ExpenseForm, ExpenseTable } from "@/components/accounting-workflow";
import { FormModal } from "@/components/form-kit";

export default function ExpensesPage() {
  const [status, setStatus] = useState("All statuses");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="expenses" subtitleKey="expensesSubtitle" action="Add expense" onActionClick={() => setIsFormOpen(true)} />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <ExpenseTable status={status} />
        <AccountingAiCard text="Transport and packaging expenses increased this week. Check whether these charges should be passed into invoice additional charges." />
      </div>
      <FormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="Add expense">
        <ExpenseForm onClose={() => setIsFormOpen(false)} />
      </FormModal>
    </div>
  );
}
