"use client";

import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import { DatePickerField, FilterBar, FormCard, FormGrid, SelectField, TextField, TextareaField } from "@/components/form-kit";
import { employees, payrollRuns } from "@/lib/data";
import { currency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Plus } from "lucide-react";

export function HrHeader({ type }: { type: "employees" | "payroll" }) {
  const { t } = useI18n();
  return (
    <SectionTitle
      title={t(type)}
      subtitle={type === "employees" ? t("employeesSubtitle") : t("payrollSubtitle")}
      action={<Button><Plus className="h-4 w-4" /> {type === "employees" ? t("addEmployee") : t("runPayroll")}</Button>}
    />
  );
}

export function HrKpis() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        [t("activeEmployees"), "4", "green"],
        [t("monthlyPayroll"), currency(176000), "blue"],
        [t("pendingApprovals"), "2", "amber"],
        [t("onLeave"), "1", "violet"],
      ].map(([label, value, tone]) => (
        <Card key={label} className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <Badge className="mt-4" tone={tone as never}>{t("hrLive")}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function EmployeeTable() {
  const { t } = useI18n();
  return (
    <DataTable
      headers={[t("employee"), t("role"), t("department"), t("attendance"), t("salary"), t("status")]}
      rows={employees.map((employee) => [
        <span key="name" className="font-semibold">{employee.name}<span className="block text-xs font-normal text-muted-foreground">{employee.id}</span></span>,
        employee.role,
        employee.department,
        employee.attendance,
        currency(employee.salary),
        <Badge key="status" tone={employee.status === "Active" ? "green" : "amber"}>{employee.status}</Badge>,
      ])}
    />
  );
}

export function PayrollTable() {
  const { t } = useI18n();
  return (
    <DataTable
      headers={[t("run"), t("period"), t("employees"), t("gross"), t("deductions"), t("net"), t("status")]}
      rows={payrollRuns.map((run) => [
        <span key="id" className="font-semibold">{run.id}</span>,
        run.period,
        run.employees,
        currency(run.gross),
        currency(run.deductions),
        currency(run.net),
        <Badge key="status" tone={run.status === "Paid" ? "green" : "amber"}>{run.status}</Badge>,
      ])}
    />
  );
}

export function HrFilters() {
  const { t } = useI18n();
  return (
    <FilterBar className="lg:grid-cols-5">
      <TextField label={t("searchPlaceholder")} placeholder="Employee, role, department" />
      <SelectField label={t("department")} options={["All departments", "Finance", "Sales", "Operations", "Support"]} />
      <SelectField label={t("status")} options={["All statuses", "Active", "On leave", "Exited"]} />
      <SelectField label={t("month")} options={["May 2026", "Apr 2026", "Mar 2026"]} />
      <Button variant="secondary" className="self-end">{t("applyFilters")}</Button>
    </FilterBar>
  );
}

export function EmployeeForm() {
  const { t } = useI18n();
  return (
    <FormCard title={t("employeeProfile")} description={t("employeeProfileDescription")} asForm>
      <FormGrid columns={3}>
        <TextField label={t("employeeId")} required pattern="EMP-[0-9]{3,}" defaultValue="EMP-005" />
        <TextField label={t("fullName")} required minLength={3} />
        <TextField label="Email" required type="email" />
        <TextField label={t("phone")} required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" />
        <SelectField label={t("department")} required options={["Finance", "Sales", "Operations", "Support"]} />
        <TextField label={t("role")} required minLength={3} />
        <DatePickerField label={t("joiningDate")} required />
        <TextField label={t("monthlySalary")} required type="number" min={1} />
        <SelectField label={t("employmentType")} required options={["Full-time", "Part-time", "Contract"]} />
        <TextareaField label={t("hrNotes")} minLength={8} />
      </FormGrid>
      <Button type="submit" className="mt-5">{t("saveEmployee")}</Button>
    </FormCard>
  );
}

export function PayrollForm() {
  const { t } = useI18n();
  return (
    <FormCard title={t("payrollRun")} description={t("payrollRunDescription")} asForm>
      <FormGrid columns={3}>
        <TextField label={t("payrollRunId")} required pattern="PAYRUN-[0-9]{4}" defaultValue="PAYRUN-0626" />
        <SelectField label={t("period")} required options={["Jun 2026", "May 2026", "Apr 2026"]} />
        <DatePickerField label={t("paymentDate")} required />
        <TextField label={t("grossSalary")} required type="number" min={1} />
        <TextField label={t("deductions")} required type="number" min={0} />
        <TextField label={t("reimbursements")} required type="number" min={0} />
        <SelectField label={t("approvalStatus")} required options={["Draft", "Pending approval", "Approved", "Paid"]} />
        <SelectField label={t("paymentMode")} required options={["Bank transfer", "Cash", "UPI"]} />
        <TextareaField label={t("payrollNotes")} minLength={8} />
      </FormGrid>
      <Button type="submit" className="mt-5">{t("savePayrollRun")}</Button>
    </FormCard>
  );
}

export function HrAiCard({ payroll = false }: { payroll?: boolean }) {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <h3 className="font-bold">{t("aiHrInsight")}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {payroll
          ? "May payroll is still in draft. Review deductions for Priya and reimbursements before generating payslips."
          : "Nilesh has lower attendance this month. Review leave balance before approving payroll for the period."}
      </p>
      <Button className="mt-5 w-full">{payroll ? t("reviewPayroll") : t("reviewAttendance")}</Button>
    </Card>
  );
}
