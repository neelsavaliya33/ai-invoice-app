"use client";

import { useMemo } from "react";
import type { ElementType } from "react";
import {
  Archive,
  Banknote,
  CalendarClock,
  ClipboardCheck,
  Copy,
  Download,
  FileDown,
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Send,
  ShieldCheck,
  Truck,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  CheckboxCard,
  CloseFormButton,
  DatePickerField,
  FormCard,
  FormGrid,
  FormSubmitRow,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { toast } from "@/components/toast";
import { usePlanModules } from "@/lib/use-plans";

const actionIcons: Record<string, ElementType> = {
  "Send reminder": Send,
  "Receive payment": Banknote,
  "Duplicate": Copy,
  "Download PDF": FileDown,
  "Create e-way bill": Truck,
  "Cancel invoice": Archive,
  "Archive": Archive,
  "Opening balance": Banknote,
  "Statement export": Download,
  "Payment reminder": Send,
  "Contact ledger": ClipboardCheck,
  "Item by contact": ClipboardCheck,
  "Credit limit update": Pencil,
  "Stock adjustment": RefreshCcw,
  "Stock transfer": Truck,
  "Reorder purchase": ClipboardCheck,
  "Serial import": Download,
  "Price update": Pencil,
  "Low-stock action": Send,
  "Ledger adjustment": Pencil,
  "Contra entry": Banknote,
  "Export ledger": Download,
  "Approve expense": ShieldCheck,
  "Reject expense": Archive,
  "Recurring expense": CalendarClock,
  "Reimbursement": Banknote,
  "Mark paid": Banknote,
  "Match invoice": ClipboardCheck,
  "Split settlement": RefreshCcw,
  "Advance entry": Banknote,
  "Refund": RefreshCcw,
  "Reconcile": ShieldCheck,
  "Create rule": ClipboardCheck,
  "Mark reviewed": ShieldCheck,
  "Cancel e-way bill": Archive,
  "Extend validity": CalendarClock,
  "Update transporter": Truck,
  "Download JSON/PDF": Download,
  "Resend invite": Send,
  "Deactivate user": Archive,
  "Transfer ownership": UserCog,
  "Access audit": ClipboardCheck,
  "Attendance entry": ClipboardCheck,
  "Leave request": CalendarClock,
  "Salary revision": Banknote,
  "Employee document": FileDown,
  "Exit employee": Archive,
  "Payslip preview": FileDown,
  "Deductions": Banknote,
  "Reimbursements": Banknote,
  "Approve payroll": ShieldCheck,
  "Export payslips": Download,
};

export function WorkflowActionMenu({
  label,
  recordLabel,
  actions,
}: {
  label: string;
  recordLabel?: string;
  actions: string[];
}) {
  function notify(action: string) {
    const risky = /archive|cancel|reject|deactivate|exit/i.test(action);
    toast({
      tone: risky ? "error" : "success",
      title: `${action} ready`,
      description: `${recordLabel || label} was updated in demo mode. No backend data was changed.`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0" aria-label={`${label} actions`}>
          <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>{label} actions</DropdownMenuLabel>
        {actions.map((action, index) => {
          const Icon = actionIcons[action] || ClipboardCheck;
          const separated = index > 0 && /archive|cancel|reject|deactivate|exit/i.test(action);
          return (
            <div key={action}>
              {separated ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem
                className={/archive|cancel|reject|deactivate|exit/i.test(action) ? "text-destructive" : undefined}
                onClick={() => notify(action)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {action}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InvoiceDocumentForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Create billing document" description="Create an invoice, quotation, sales order, delivery challan, credit note, or debit note from one validated workflow." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Billing document created">
      <FormGrid columns={3}>
        <LookupSelectField label="Document type" group="document-types" required fallbackOptions={["Tax invoice", "Quotation", "Sales order", "Delivery challan", "Credit note", "Debit note"].map((value) => ({ value, label: value }))} />
        <TextField label="Document number" required pattern="[A-Z]{2,4}-[0-9]{4,}" placeholder="INV-1054" />
        <DatePickerField label="Document date" required />
        <LookupSelectField label="Customer" group="customers" required fallbackOptions={[{ value: "Kavya Textiles", label: "Kavya Textiles" }, { value: "Prime Mobile Hub", label: "Prime Mobile Hub" }]} />
        <LookupSelectField label="Payment terms" group="payment-terms" required />
        <DatePickerField label="Due date" required />
        <TextField label="Line item" required minLength={3} placeholder="Cotton roll A-12" />
        <TextField label="Quantity" required type="number" min={1} placeholder="20" />
        <TextField label="Rate" required type="number" min={1} placeholder="1850" />
        <LookupSelectField label="GST rate" group="gst-rates" required />
        <TextField label="Dispatch city" required minLength={3} placeholder="Surat" />
        <TextField label="Ship to city" required minLength={3} placeholder="Ahmedabad" />
        <TextareaField label="Customer notes" required minLength={10} placeholder="Material packed in bundles. Verify quantity and shade before unloading." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow>
        <Button type="submit">Save document</Button>
      </FormSubmitRow>
    </FormCard>
  );
}

export function CustomerLedgerActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Customer ledger action" description="Update opening balance, credit limit, reminder settings, or export a statement for a customer/vendor." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Customer ledger action saved">
      <FormGrid>
        <LookupSelectField label="Action type" group="customer-actions" required fallbackOptions={["Opening balance", "Statement export", "Payment reminder", "Contact ledger", "Item by contact", "Credit limit update"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Party" group="customers" required fallbackOptions={[{ value: "Kavya Textiles", label: "Kavya Textiles" }, { value: "Mehta Traders", label: "Mehta Traders" }]} />
        <DatePickerField label="Action date" required />
        <TextField label="Amount or limit" required type="number" min={0} placeholder="200000" />
        <TextareaField label="Notes" required minLength={8} placeholder="Use this action for ledger follow-up and customer credit review." fieldClassName="md:col-span-2" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function PaymentActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Record payment" description="Record receipt, supplier payment, advance, refund, or invoice settlement with matching notes." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Payment recorded">
      <FormGrid columns={3}>
        <LookupSelectField label="Payment action" group="payment-actions" required fallbackOptions={["Receive payment", "Supplier payment", "Match invoice", "Split settlement", "Advance entry", "Refund"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Party" group="customers" required fallbackOptions={[{ value: "Kavya Textiles", label: "Kavya Textiles" }, { value: "Mehta Traders", label: "Mehta Traders" }]} />
        <DatePickerField label="Payment date" required />
        <TextField label="Amount" required type="number" min={1} placeholder="46800" />
        <LookupSelectField label="Mode" group="payment-methods" required />
        <TextField label="Reference number" required minLength={3} placeholder="UPI-452781" />
        <TextareaField label="Settlement notes" required minLength={8} placeholder="Match this receipt with overdue invoice and update ledger follow-up status." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save payment</Button></FormSubmitRow>
    </FormCard>
  );
}

export function StockActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Inventory action" description="Adjust stock, transfer inventory, reorder from purchase, import serials, or update item price." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Inventory action saved">
      <FormGrid columns={3}>
        <LookupSelectField label="Action type" group="stock-actions" required fallbackOptions={["Stock adjustment", "Stock transfer", "Reorder purchase", "Serial import", "Price update", "Low-stock action"].map((value) => ({ value, label: value }))} />
        <TextField label="SKU" required pattern="[A-Z0-9-]{2,}" placeholder="A-12" />
        <TextField label="Serial or batch" required minLength={3} placeholder="TXT-A12-2026-0008" />
        <TextField label="Quantity" required type="number" min={1} placeholder="12" />
        <LookupSelectField label="Warehouse" group="warehouses" required fallbackOptions={[{ value: "Main warehouse", label: "Main warehouse" }, { value: "Retail counter", label: "Retail counter" }]} />
        <DatePickerField label="Action date" required />
        <TextareaField label="Reason" required minLength={8} placeholder="Stock correction based on physical count and reorder review." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save stock action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function JournalEntryForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Journal entry" description="Post a balanced manual entry, opening balance, ledger adjustment, or contra transaction." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Journal entry posted">
      <FormGrid columns={3}>
        <DatePickerField label="Entry date" required />
        <TextField label="Voucher number" required pattern="JV-[0-9]{4,}" placeholder="JV-0042" />
        <LookupSelectField label="Entry type" group="journal-entry-types" required fallbackOptions={["Journal entry", "Ledger adjustment", "Contra entry", "Opening balance"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Debit account" group="accounts" required fallbackOptions={[{ value: "Accounts Receivable", label: "Accounts Receivable" }, { value: "Cash in Bank", label: "Cash in Bank" }]} />
        <LookupSelectField label="Credit account" group="accounts" required fallbackOptions={[{ value: "Sales Revenue", label: "Sales Revenue" }, { value: "Accounts Payable", label: "Accounts Payable" }]} />
        <TextField label="Amount" required type="number" min={1} placeholder="12500" />
        <TextareaField label="Narration" required minLength={10} placeholder="Adjustment entered after ledger review with supporting internal note." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Post entry</Button></FormSubmitRow>
    </FormCard>
  );
}

export function BankActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Banking action" description="Import a statement, create manual bank transaction, reconcile, add a rule, or mark a transaction reviewed." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Bank action saved">
      <FormGrid>
        <LookupSelectField label="Action type" group="bank-actions" required fallbackOptions={["Import bank statement", "Manual transaction", "Reconcile transaction", "Create rule", "Mark reviewed"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Bank account" group="bank-accounts" required fallbackOptions={[{ value: "HDFC Current Account", label: "HDFC Current Account" }, { value: "ICICI Collection Account", label: "ICICI Collection Account" }]} />
        <DatePickerField label="Transaction date" required />
        <TextField label="Amount" required type="number" min={1} placeholder="46800" />
        <TextareaField label="Narration or rule" required minLength={8} placeholder="Match bank credit to invoice receipt and mark transaction reviewed." fieldClassName="md:col-span-2" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save bank action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function GstReturnForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="GST and tax action" description="Prepare returns, reconcile GST, review input credit, export summaries, or lock a tax period." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Tax action prepared">
      <FormGrid columns={3}>
        <LookupSelectField label="Return action" group="gst-actions" required fallbackOptions={["Prepare GSTR-1", "Prepare GSTR-3B", "TDS report", "GST reconciliation", "Input GST review", "Export return summary", "Lock period"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Tax period" group="report-periods" required fallbackOptions={[{ value: "May 2026", label: "May 2026" }, { value: "Apr 2026", label: "Apr 2026" }]} />
        <DatePickerField label="Review date" required />
        <TextField label="Output GST" required type="number" min={0} placeholder="84200" />
        <TextField label="Input GST" required type="number" min={0} placeholder="31150" />
        <TextField label="TDS payable" required type="number" min={0} placeholder="4200" />
        <TextareaField label="Review notes" required minLength={10} placeholder="Review outward supply, input credit, and TDS before marking the period ready." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Prepare tax action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function ReportConfigForm({ reportName, onClose }: { reportName: string; onClose?: () => void }) {
  return (
    <FormCard title={`${reportName} configuration`} description="Choose filters, columns, export format, schedule, and saved view settings for this report." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Report configuration saved">
      <FormGrid columns={3}>
        <DatePickerField label="From date" required />
        <DatePickerField label="To date" required />
        <LookupSelectField label="Export format" group="export-formats" required fallbackOptions={[{ value: "PDF", label: "PDF" }, { value: "Excel", label: "Excel" }, { value: "CSV", label: "CSV" }]} />
        <TextField label="Columns" required minLength={5} placeholder="Date, Party, Amount, Status, GST" />
        <LookupSelectField label="Schedule" group="report-schedules" required fallbackOptions={["No schedule", "Daily", "Weekly", "Monthly"].map((value) => ({ value, label: value }))} />
        <TextField label="Saved view name" required minLength={3} placeholder={`${reportName} - owner view`} />
        <TextareaField label="Filter notes" required minLength={8} placeholder="Saved filter view for management review and export." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save report view</Button></FormSubmitRow>
    </FormCard>
  );
}

export function RolePermissionForm({ onClose }: { onClose?: () => void }) {
  const { modules } = usePlanModules();
  const visibleModules = useMemo(() => modules.slice(0, 8), [modules]);
  return (
    <FormCard title="Role permission editor" description="Assign module access using the backend plan module and capability catalog." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Role permissions saved">
      <FormGrid>
        <TextField label="Role name" required minLength={3} placeholder="Inventory manager" />
        <LookupSelectField label="Access level" group="access-levels" required fallbackOptions={["View only", "Create and edit", "Admin"].map((value) => ({ value, label: value }))} />
      </FormGrid>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {visibleModules.length ? visibleModules.map((module) => (
          <CheckboxCard key={module.code} label={module.name} description={`${module.capabilities.length} capabilities available`} defaultChecked />
        )) : (
          <CheckboxCard label="Module catalog unavailable" description="Start the backend to load permission modules from the API." />
        )}
      </div>
      <FormSubmitRow><Button type="submit">Save role permissions</Button></FormSubmitRow>
    </FormCard>
  );
}

export function EmployeeActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Employee action" description="Record attendance, leave, salary revision, document metadata, or employee exit." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Employee action saved">
      <FormGrid>
        <LookupSelectField label="Action type" group="employee-actions" required fallbackOptions={["Attendance entry", "Leave request", "Salary revision", "Employee document", "Exit employee"].map((value) => ({ value, label: value }))} />
        <TextField label="Employee ID" required pattern="EMP-[0-9]{3,}" placeholder="EMP-002" />
        <DatePickerField label="Effective date" required />
        <TextField label="Amount or days" required type="number" min={0} placeholder="1" />
        <TextareaField label="HR notes" required minLength={8} placeholder="Employee workflow action recorded for payroll and audit review." fieldClassName="md:col-span-2" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save employee action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function PayrollActionForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Payroll action" description="Preview payslips, adjust deductions, reimbursements, approvals, payments, or exports." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Payroll action saved">
      <FormGrid columns={3}>
        <LookupSelectField label="Payroll action" group="payroll-actions" required fallbackOptions={["Payslip preview", "Deductions", "Reimbursements", "Approve payroll", "Mark paid", "Export payslips"].map((value) => ({ value, label: value }))} />
        <TextField label="Payroll run" required pattern="PAYRUN-[0-9]{4}" placeholder="PAYRUN-0526" />
        <DatePickerField label="Action date" required />
        <TextField label="Gross amount" required type="number" min={1} placeholder="176000" />
        <TextField label="Deduction amount" required type="number" min={0} placeholder="18500" />
        <TextField label="Reimbursement amount" required type="number" min={0} placeholder="4200" />
        <TextareaField label="Payroll notes" required minLength={8} placeholder="Review deductions and reimbursements before marking payroll paid." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save payroll action</Button></FormSubmitRow>
    </FormCard>
  );
}

export function SettingsProfileForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Workspace settings" description="Update company profile, invoice numbering, templates, taxes, bank details, security, theme, language, and plan limits." action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Settings saved">
      <FormGrid columns={3}>
        <TextField label="Company name" required minLength={3} placeholder="Kavya Textiles Private Limited" />
        <TextField label="GSTIN" pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" placeholder="Optional GSTIN" />
        <LookupSelectField label="Industry" group="industries" required fallbackOptions={[{ value: "Textile", label: "Textile" }, { value: "Electronics", label: "Electronics" }]} />
        <TextField label="Invoice prefix" required pattern="[A-Z]{2,5}" placeholder="INV" />
        <LookupSelectField label="Invoice template" group="invoice-templates" required fallbackOptions={["Compact GST", "Modern GST", "Transport invoice"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Theme" group="theme-modes" required fallbackOptions={["System", "Light", "Dark"].map((value) => ({ value, label: value }))} />
        <LookupSelectField label="Language" group="languages" required fallbackOptions={["English", "Gujarati", "Hindi", "Marathi"].map((value) => ({ value, label: value }))} />
        <TextField label="Bank account" required minLength={6} placeholder="HDFC Current Account" />
        <TextField label="Plan limit note" required minLength={6} placeholder="Review seats, AI credits, companies, and e-way bill usage monthly." />
        <TextareaField label="Security notes" required minLength={10} placeholder="Require owner approval for role changes, exports, and company profile edits." fieldClassName="md:col-span-2 xl:col-span-3" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Save settings</Button></FormSubmitRow>
    </FormCard>
  );
}
