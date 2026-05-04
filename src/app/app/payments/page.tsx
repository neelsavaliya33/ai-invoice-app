"use client";

import { AccountingAiCard, AccountingFilters, AccountingHeader, PaymentTable } from "@/components/accounting-workflow";
import { FormCard, FormGrid, SelectField, TextField, TextareaField } from "@/components/form-kit";
import { Button } from "@/components/ui";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="payments" subtitleKey="paymentsSubtitle" action="Record payment" />
      <AccountingFilters />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <PaymentTable />
        <AccountingAiCard text="One cash receipt is unmatched. Match PAY-3023 to Mehta Traders or mark it as advance before month-end closing." />
      </div>
      <FormCard title="Record payment" description="Use for customer receipts, supplier payments, advances, and settlement notes." asForm>
        <FormGrid columns={3}>
          <SelectField label="Payment type" required options={["Received", "Paid"]} />
          <TextField label="Party" required minLength={3} />
          <TextField label="Payment date" required type="date" />
          <SelectField label="Mode" required options={["UPI", "Bank", "Cash", "Cheque"]} />
          <TextField label="Amount" required type="number" min={1} />
          <TextField label="Transaction ID" pattern="[A-Za-z0-9\\-/]{4,}" />
          <TextareaField label="Notes" minLength={8} />
        </FormGrid>
        <Button type="submit" className="mt-5">Save payment</Button>
      </FormCard>
    </div>
  );
}
