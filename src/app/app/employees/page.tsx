"use client";

import { EmployeeForm, EmployeeTable, HrAiCard, HrFilters, HrHeader, HrKpis } from "@/components/hr-workflow";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <HrHeader type="employees" />
      <HrKpis />
      <HrFilters />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <EmployeeTable />
        <HrAiCard />
      </div>
      <EmployeeForm />
    </div>
  );
}
