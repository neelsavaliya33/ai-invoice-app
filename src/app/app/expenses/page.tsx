"use client";

import { AccountingAiCard, AccountingFilters, AccountingHeader, ExpenseForm, ExpenseTable } from "@/components/accounting-workflow";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="expenses" subtitleKey="expensesSubtitle" action="Add expense" />
      <AccountingFilters />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <ExpenseTable />
        <AccountingAiCard text="Transport and packaging expenses increased this week. Check whether these charges should be passed into invoice additional charges." />
      </div>
      <ExpenseForm />
    </div>
  );
}
