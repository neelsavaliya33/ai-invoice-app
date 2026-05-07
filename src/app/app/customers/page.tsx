"use client";

import { useState } from "react";
import { AiActionCard, CustomerRows, PageHeaderActions } from "@/components/workflow";
import { Button } from "@/components/ui";
import { CloseFormButton, FilterBar, FormCard, FormGrid, SlideFormPanel, TextareaField, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { useI18n } from "@/lib/i18n";

export default function CustomersPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [balance, setBalance] = useState("Any balance");
  const [location, setLocation] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("customers")} subtitle={t("manageLedgers")} button={t("addCustomer")} onButtonClick={() => setIsFormOpen(true)} />
      <FilterBar>
        <TextField label="Search" placeholder="Name, phone, or GSTIN" onInput={(event) => setQuery(event.currentTarget.value)} />
        <LookupSelectField label="Customer type" group="customer-types" prependOptions={[{ label: "All types", value: "All types" }]} onChange={(event) => setType(event.currentTarget.value)} />
        <LookupSelectField label="Balance status" group="balance-statuses" onChange={(event) => setBalance(event.currentTarget.value)} />
        <TextField label="Location" placeholder="City or state" onInput={(event) => setLocation(event.currentTarget.value)} />
      </FilterBar>
      <div className={`grid gap-6 ${isFormOpen ? "xl:grid-cols-[1fr_360px]" : ""}`}>
        <CustomerRows query={query} type={type} balance={balance} location={location} />
        <SlideFormPanel open={isFormOpen}>
          <FormCard title="Add customer or vendor" description="Create a ledger profile with GSTIN, contact details, credit limit, and follow-up notes." action={<CloseFormButton onClick={() => setIsFormOpen(false)} />} asForm>
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
        </SlideFormPanel>
      </div>
      <AiActionCard />
    </div>
  );
}
