"use client";

import { useState } from "react";
import { EmployeeForm, EmployeeTable, HrAiCard, HrFilters, HrHeader, HrKpis } from "@/components/hr-workflow";

export default function EmployeesPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [status, setStatus] = useState("All statuses");
  return (
    <div className="space-y-6">
      <HrHeader type="employees" />
      <HrKpis />
      <HrFilters query={query} department={department} status={status} onQueryChange={setQuery} onDepartmentChange={setDepartment} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <EmployeeTable query={query} department={department} status={status} />
        <HrAiCard />
      </div>
      <EmployeeForm />
    </div>
  );
}
