"use client";

import { HrAiCard, HrFilters, HrHeader, HrKpis, PayrollForm, PayrollTable } from "@/components/hr-workflow";

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <HrHeader type="payroll" />
      <HrKpis />
      <HrFilters />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <PayrollTable />
        <HrAiCard payroll />
      </div>
      <PayrollForm />
    </div>
  );
}
