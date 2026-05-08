"use client";

import { useState } from "react";
import { AccountingAiCard, AccountingFilters, AccountingHeader, PurchaseTable } from "@/components/accounting-workflow";
import { CloseFormButton, DatePickerField, FormCard, FormGrid, FormModal, FormSubmitRow, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { Button } from "@/components/ui";

export default function PurchasesPage() {
  const [status, setStatus] = useState("All statuses");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <AccountingHeader titleKey="purchases" subtitleKey="purchasesSubtitle" action="New purchase" onActionClick={() => setIsFormOpen(true)} />
      <AccountingFilters status={status} onStatusChange={setStatus} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <PurchaseTable status={status} />
        <AccountingAiCard text="Cotton roll A-12 is below reorder level. Convert PO-1187 balance into a supplier payment plan before placing another order." />
      </div>
      <FormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="Add purchase bill">
        <FormCard title="Add purchase bill" description="Create supplier bill with items, GST input credit, and payable tracking." action={<CloseFormButton onClick={() => setIsFormOpen(false)} />} asForm>
          <FormGrid columns={3}>
            <TextField label="Purchase bill" required pattern="PB-[0-9]{4,}" defaultValue="PB-2201" />
            <TextField label="Supplier" required minLength={3} defaultValue="Rang Fabrics" />
            <DatePickerField label="Bill date" required defaultValue="2026-05-07" />
            <LookupSelectField label="GST treatment" group="tax-types" required />
            <TextField label="Amount" required type="number" min={1} />
            <TextField label="Input GST" required type="number" min={0} />
          </FormGrid>
          <FormSubmitRow>
            <Button type="submit">Save purchase bill</Button>
          </FormSubmitRow>
        </FormCard>
      </FormModal>
    </div>
  );
}
