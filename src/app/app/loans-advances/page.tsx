 "use client";

import { EmptyWorkflowPage } from "@/components/hisab-workflows";
import { DatePickerField, FormCard, FormGrid, TextareaField, TextField, CloseFormButton, FormSubmitRow } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { Button } from "@/components/ui";

export default function LoansAdvancesPage() {
  return (
    <EmptyWorkflowPage title="Loans & advances" subtitle="No loans or advances recorded yet" cta="Add loan or advance">
      {(close) => (
        <FormCard title="New loan or advance" action={<CloseFormButton onClick={close} />} asForm successMessage="Loan or advance saved">
          <FormGrid>
            <LookupSelectField label="Entry type" group="loan-types" required fallbackOptions={[{ value: "Loan given", label: "Loan given" }, { value: "Loan taken", label: "Loan taken" }, { value: "Staff advance", label: "Staff advance" }]} />
            <LookupSelectField label="Contact or employee" group="customers" required fallbackOptions={[{ value: "Kavya Textiles", label: "Kavya Textiles" }, { value: "Priya Patel", label: "Priya Patel" }]} />
            <DatePickerField label="Date" required defaultValue="2026-05-08" />
            <TextField label="Amount" required type="number" min={1} defaultValue="50000" />
            <TextareaField label="Terms" defaultValue="Repayment expected within 60 days." fieldClassName="md:col-span-2" />
          </FormGrid>
          <FormSubmitRow><Button type="submit">Create</Button></FormSubmitRow>
        </FormCard>
      )}
    </EmptyWorkflowPage>
  );
}
