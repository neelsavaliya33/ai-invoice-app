"use client";

import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import { CloseFormButton, DatePickerField, FilterBar, FormCard, FormGrid, FormSubmitRow, SelectField, TextField, TextareaField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { WorkflowActionMenu } from "@/components/workflow-actions";
import { employees, payrollRuns } from "@/lib/data";
import { currency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Plus } from "lucide-react";
import { toast } from "@/components/toast";

export function HrHeader({ type, onActionClick }: { type: "employees" | "payroll"; onActionClick?: () => void }) {
  const { t } = useI18n();
  return (
    <SectionTitle
      title={t(type)}
      subtitle={type === "employees" ? t("employeesSubtitle") : t("payrollSubtitle")}
      action={<Button onClick={onActionClick}><Plus className="h-4 w-4" /> {type === "employees" ? t("addEmployee") : t("runPayroll")}</Button>}
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

export function EmployeeTable({ query = "", department = "All departments", status = "All statuses" }: { query?: string; department?: string; status?: string }) {
  const { t } = useI18n();
  const rows = employees.filter((employee) => {
    const matchesQuery = `${employee.name} ${employee.role} ${employee.department}`.toLowerCase().includes(query.toLowerCase());
    const matchesDepartment = department === "All departments" || employee.department === department;
    const matchesStatus = status === "All statuses" || employee.status === status;
    return matchesQuery && matchesDepartment && matchesStatus;
  });
  return (
    <DataTable
      headers={[t("employee"), t("role"), t("department"), t("attendance"), t("salary"), t("status"), "Actions"]}
      rows={rows.map((employee) => [
        <span key="name" className="font-semibold">{employee.name}<span className="block text-xs font-normal text-muted-foreground">{employee.id}</span></span>,
        employee.role,
        employee.department,
        employee.attendance,
        currency(employee.salary),
        <Badge key="status" tone={employee.status === "Active" ? "green" : "amber"}>{employee.status}</Badge>,
        <WorkflowActionMenu key="actions" label="Employee" recordLabel={employee.name} actions={["Attendance entry", "Leave request", "Salary revision", "Employee document", "Exit employee"]} />,
      ])}
    />
  );
}

export function PayrollTable({ status = "All statuses", month = "All months" }: { status?: string; month?: string }) {
  const { t } = useI18n();
  const rows = payrollRuns.filter((run) => {
    const matchesStatus = status === "All statuses" || run.status === status;
    const matchesMonth = month === "All months" || run.period === month;
    return matchesStatus && matchesMonth;
  });
  return (
    <DataTable
      headers={[t("run"), t("period"), t("employees"), t("gross"), t("deductions"), t("net"), t("status"), "Actions"]}
      rows={rows.map((run) => [
        <span key="id" className="font-semibold">{run.id}</span>,
        run.period,
        run.employees,
        currency(run.gross),
        currency(run.deductions),
        currency(run.net),
        <Badge key="status" tone={run.status === "Paid" ? "green" : "amber"}>{run.status}</Badge>,
        <WorkflowActionMenu key="actions" label="Payroll" recordLabel={run.id} actions={["Payslip preview", "Deductions", "Reimbursements", "Approve payroll", "Mark paid", "Export payslips"]} />,
      ])}
    />
  );
}

export function HrFilters({ query, department, status, month, onQueryChange, onDepartmentChange, onStatusChange, onMonthChange }: { query?: string; department?: string; status?: string; month?: string; onQueryChange?: (value: string) => void; onDepartmentChange?: (value: string) => void; onStatusChange?: (value: string) => void; onMonthChange?: (value: string) => void }) {
  const { t } = useI18n();
  return (
    <FilterBar className="lg:grid-cols-5">
      <TextField label={t("searchPlaceholder")} value={query} placeholder="Employee, role, department" onInput={(event) => onQueryChange?.(event.currentTarget.value)} />
      <LookupSelectField label={t("department")} group="departments" value={department} prependOptions={[{ label: "All departments", value: "All departments" }]} onChange={(event) => onDepartmentChange?.(event.currentTarget.value)} />
      <LookupSelectField label={t("status")} group="employee-statuses" value={status} prependOptions={[{ label: "All statuses", value: "All statuses" }, { label: "Draft", value: "Draft" }, { label: "Paid", value: "Paid" }]} onChange={(event) => onStatusChange?.(event.currentTarget.value)} />
      <SelectField label={t("month")} value={month} options={["All months", "May 2026", "Apr 2026", "Mar 2026"]} onChange={(event) => onMonthChange?.(event.currentTarget.value)} />
      <Button variant="secondary" className="self-end">{t("applyFilters")}</Button>
    </FilterBar>
  );
}

export function EmployeeForm({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();
  return (
    <FormCard title={t("employeeProfile")} description={t("employeeProfileDescription")} action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm>
      <FormGrid columns={3}>
        <TextField label={t("employeeId")} required pattern="EMP-[0-9]{3,}" placeholder="EMP-005" />
        <TextField label={t("fullName")} required minLength={3} />
        <TextField label="Email" required type="email" />
        <TextField label={t("phone")} required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" />
        <LookupSelectField label={t("department")} group="departments" required />
        <TextField label={t("role")} required minLength={3} />
        <DatePickerField label={t("joiningDate")} required />
        <TextField label={t("monthlySalary")} required type="number" min={1} />
        <LookupSelectField label={t("employmentType")} group="employment-types" required />
        <TextareaField label={t("hrNotes")} minLength={8} fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow>
        <Button type="submit">{t("saveEmployee")}</Button>
      </FormSubmitRow>
    </FormCard>
  );
}

export function PayrollForm({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();
  return (
    <FormCard title={t("payrollRun")} description={t("payrollRunDescription")} action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm>
      <FormGrid columns={3}>
        <TextField label={t("payrollRunId")} required pattern="PAYRUN-[0-9]{4}" placeholder="PAYRUN-0626" />
        <SelectField label={t("period")} required options={["Jun 2026", "May 2026", "Apr 2026"]} />
        <DatePickerField label={t("paymentDate")} required />
        <TextField label={t("grossSalary")} required type="number" min={1} />
        <TextField label={t("deductions")} required type="number" min={0} />
        <TextField label={t("reimbursements")} required type="number" min={0} />
        <LookupSelectField label={t("approvalStatus")} group="payroll-statuses" required />
        <LookupSelectField label={t("paymentMode")} group="payment-methods" required />
        <TextareaField label={t("payrollNotes")} minLength={8} fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow>
        <Button type="submit">{t("savePayrollRun")}</Button>
      </FormSubmitRow>
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
      <Button
        className="mt-5 w-full"
        onClick={() => toast({ tone: "success", title: payroll ? "Payroll review opened" : "Attendance review opened", description: "The review action was queued in demo mode." })}
      >
        {payroll ? t("reviewPayroll") : t("reviewAttendance")}
      </Button>
    </Card>
  );
}
