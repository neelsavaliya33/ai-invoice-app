"use client";

import { useState } from "react";
import { HrAiCard, HrFilters, HrHeader, HrKpis, PayrollForm, PayrollTable } from "@/components/hr-workflow";
import { SlideFormPanel } from "@/components/form-kit";

export default function PayrollPage() {
  const [status, setStatus] = useState("All statuses");
  const [month, setMonth] = useState("All months");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <HrHeader type="payroll" onActionClick={() => setIsFormOpen(true)} />
      <HrKpis />
      <HrFilters status={status} month={month} onStatusChange={setStatus} onMonthChange={setMonth} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <PayrollTable status={status} month={month} />
        <HrAiCard payroll />
      </div>
      <SlideFormPanel open={isFormOpen}>
        <PayrollForm onClose={() => setIsFormOpen(false)} />
      </SlideFormPanel>
    </div>
  );
}
