"use client";

import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import { DatePickerField, FilterBar, FormCard, FormGrid, SelectField, TextField, TextareaField } from "@/components/form-kit";
import { currency } from "@/lib/utils";
import { bankTransactions, expenses, gstSummary, ledgerEntries, payments, purchases } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { ArrowUpRight, Plus } from "lucide-react";

export function AccountingHeader({ titleKey, subtitleKey, action }: { titleKey: "accounting" | "expenses" | "purchases" | "payments" | "banking" | "taxGst"; subtitleKey: "accountingSubtitle" | "expensesSubtitle" | "purchasesSubtitle" | "paymentsSubtitle" | "bankingSubtitle" | "taxSubtitle"; action?: string }) {
  const { t } = useI18n();
  return <SectionTitle title={t(titleKey)} subtitle={t(subtitleKey)} action={action ? <Button><Plus className="h-4 w-4" /> {action}</Button> : undefined} />;
}

export function AccountingKpis() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        [t("accountingReceivables"), 281450, "blue"],
        [t("payables"), 95000, "amber"],
        [t("cashInBank"), 486000, "green"],
        [t("gstPayable"), 84200, "red"],
      ].map(([label, value, tone]) => (
        <Card key={label as string} className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold">{currency(value as number)}</p>
          <Badge className="mt-4" tone={tone as never}>{t("liveLedger")}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function LedgerTable({ status = "All statuses" }: { status?: string }) {
  const { t } = useI18n();
  const rows = ledgerEntries.filter(() => status === "All statuses" || status === "Matched");
  return (
    <DataTable
      headers={[t("date"), t("account"), t("debit"), t("credit"), t("reference")]}
      rows={rows.map((entry) => [
        entry.date,
        <span key="account" className="font-semibold">{entry.account}</span>,
        entry.debit ? currency(entry.debit) : "-",
        entry.credit ? currency(entry.credit) : "-",
        entry.ref,
      ])}
    />
  );
}

export function ExpenseTable({ status = "All statuses" }: { status?: string }) {
  const { t } = useI18n();
  const rows = expenses.filter((expense) => status === "All statuses" || expense.status === status);
  return (
    <DataTable
      headers={[t("expense"), t("vendor"), t("category"), t("date"), t("amount"), t("status")]}
      rows={rows.map((expense) => [
        <span key="id" className="font-semibold">{expense.id}</span>,
        expense.vendor,
        expense.category,
        expense.date,
        currency(expense.amount),
        <Badge key="status" tone={expense.status === "Pending" ? "amber" : expense.status === "Paid" ? "green" : "blue"}>{expense.status}</Badge>,
      ])}
    />
  );
}

export function PurchaseTable({ status = "All statuses" }: { status?: string }) {
  const { t } = useI18n();
  const rows = purchases.filter((purchase) => status === "All statuses" || purchase.status === status);
  return (
    <DataTable
      headers={["PO", t("supplier"), t("status"), t("date"), t("amount"), t("payable")]}
      rows={rows.map((purchase) => [
        <span key="id" className="font-semibold">{purchase.id}</span>,
        purchase.supplier,
        <Badge key="status" tone={purchase.status === "Ordered" ? "amber" : purchase.status === "Partial" ? "blue" : "green"}>{purchase.status}</Badge>,
        purchase.date,
        currency(purchase.amount),
        currency(purchase.payable),
      ])}
    />
  );
}

export function PaymentTable({ status = "All statuses" }: { status?: string }) {
  const { t } = useI18n();
  const rows = payments.filter((payment) => status === "All statuses" || payment.status === status);
  return (
    <DataTable
      headers={[t("payment"), t("party"), t("type"), t("mode"), t("date"), t("amount"), t("status")]}
      rows={rows.map((payment) => [
        <span key="id" className="font-semibold">{payment.id}</span>,
        payment.party,
        <Badge key="type" tone={payment.type === "Received" ? "green" : "amber"}>{payment.type}</Badge>,
        payment.mode,
        payment.date,
        currency(payment.amount),
        <Badge key="status" tone={payment.status === "Matched" ? "green" : "red"}>{payment.status}</Badge>,
      ])}
    />
  );
}

export function BankTable({ status = "All statuses" }: { status?: string }) {
  const { t } = useI18n();
  const rows = bankTransactions.filter((txn) => status === "All statuses" || txn.status === status);
  return (
    <DataTable
      headers={[t("txn"), t("date"), t("narration"), t("type"), t("amount"), t("status")]}
      rows={rows.map((txn) => [
        <span key="id" className="font-semibold">{txn.id}</span>,
        txn.date,
        txn.narration,
        <Badge key="type" tone={txn.type === "Credit" ? "green" : "amber"}>{txn.type}</Badge>,
        currency(txn.amount),
        <Badge key="status" tone={txn.status === "Reconciled" ? "green" : "red"}>{txn.status}</Badge>,
      ])}
    />
  );
}

export function GstCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {gstSummary.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-3 text-2xl font-bold">{item.status === "Ready %" ? `${item.amount}%` : currency(item.amount)}</p>
          <Badge className="mt-4" tone={item.status === "Due" ? "red" : item.status === "Credit" ? "blue" : "green"}>{item.status}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function AccountingFilters({ status, onStatusChange }: { status?: string; onStatusChange?: (status: string) => void }) {
  const { t } = useI18n();
  return (
    <FilterBar className="lg:grid-cols-5">
      <DatePickerField label={t("from")} />
      <DatePickerField label={t("to")} />
      <SelectField label={t("account")} options={["All accounts", "Sales Revenue", "Accounts Receivable", "Transport Expense", "Output GST"]} />
      <SelectField label={t("status")} value={status} options={["All statuses", "Pending", "Paid", "Matched", "Needs review", "Approved", "Received", "Ordered", "Partial", "Reconciled"]} onChange={(event) => onStatusChange?.(event.currentTarget.value)} />
      <Button variant="secondary" className="self-end">{t("applyFilters")}</Button>
    </FilterBar>
  );
}

export function ExpenseForm() {
  const { t } = useI18n();
  return (
    <FormCard title={t("expenseEntry")} description={t("expenseEntryDescription")} asForm>
      <FormGrid>
        <TextField label={t("expenseNumber")} required defaultValue="EXP-2105" pattern="EXP-[0-9]{4,}" />
        <TextField label={t("vendor")} required minLength={3} placeholder="Vendor name" />
        <SelectField label={t("category")} required options={["Transport", "Packaging", "Office supplies", "Software", "Rent"]} />
        <DatePickerField label={t("expenseDate")} required />
        <TextField label={t("amount")} required type="number" min={1} placeholder="0" />
        <SelectField label={t("gstRate")} required options={["0%", "5%", "12%", "18%", "28%"]} />
        <SelectField label={t("paymentStatus")} required options={["Pending", "Paid", "Approved"]} />
        <TextField label={t("reference")} placeholder="Bill or receipt number" />
        <TextareaField label={t("notes")} minLength={8} placeholder="Approval or accounting notes" />
      </FormGrid>
      <Button type="submit" className="mt-5">{t("saveExpense")}</Button>
    </FormCard>
  );
}

export function AccountingAiCard({ text }: { text: string }) {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <h3 className="font-bold">{t("aiAccountingInsight")}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
      <Button className="mt-5 w-full">{t("createAction")}</Button>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted p-3 text-sm">
        <span>{t("reviewAuditTrail")}</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </Card>
  );
}
