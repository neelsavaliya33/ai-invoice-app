"use client";

import { AiActionCard, CustomerRows, PageHeaderActions } from "@/components/workflow";
import { Button } from "@/components/ui";
import { FilterBar, FormCard, FormGrid, TextareaField, TextField, SelectField } from "@/components/form-kit";
import { useI18n } from "@/lib/i18n";

export default function CustomersPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("customers")} subtitle={t("manageLedgers")} button={t("addCustomer")} />
      <FilterBar>
        <TextField label="Search" placeholder="Name, phone, or GSTIN" />
        <SelectField label="Customer type" options={["All types", "Textile", "Retail"]} />
        <SelectField label="Balance status" options={["Any balance", "Outstanding", "Clear"]} />
        <TextField label="Location" placeholder="City or state" />
      </FilterBar>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <CustomerRows />
        <FormCard title="Customer profile form" description="Reusable customer form block for create and edit screens." asForm>
          <FormGrid columns={1}>
            <TextField label="Business name" required minLength={3} defaultValue="Kavya Textiles" />
            <TextField label="GSTIN" required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" helper="15-character GSTIN format" defaultValue="24ABCDE1234F1Z5" />
            <TextField label="Contact person" required minLength={3} defaultValue="Rohan Shah" />
            <TextField label="WhatsApp number" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" defaultValue="+91 98765 43210" />
            <TextField label="Credit limit" required pattern="^INR\\s?[0-9,]+$" defaultValue="INR 2,00,000" />
            <TextareaField label="Internal notes" minLength={10} defaultValue="Prefers WhatsApp reminders and 7-day terms." />
            <Button type="submit">Save customer</Button>
          </FormGrid>
        </FormCard>
      </div>
      <AiActionCard />
    </div>
  );
}
