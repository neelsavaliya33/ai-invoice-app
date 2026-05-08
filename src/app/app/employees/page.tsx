"use client";

import { useState } from "react";
import { EmployeeForm, EmployeeTable, HrAiCard, HrFilters, HrHeader, HrKpis } from "@/components/hr-workflow";
import { FormModal } from "@/components/form-kit";

export default function EmployeesPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <HrHeader type="employees" onActionClick={() => setIsFormOpen(true)} />
      <HrKpis />
      <HrFilters query={query} department={department} status={status} onQueryChange={setQuery} onDepartmentChange={setDepartment} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <EmployeeTable query={query} department={department} status={status} />
        <HrAiCard />
      </div>
      <FormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="Employee profile">
        <EmployeeForm onClose={() => setIsFormOpen(false)} />
      </FormModal>
    </div>
  );
}
