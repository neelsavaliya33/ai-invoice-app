"use client";

import { useState } from "react";
import { AiActionCard, InventoryRows, PageHeaderActions } from "@/components/workflow";
import { Button } from "@/components/ui";
import { CloseFormButton, DatePickerField, FilterBar, FormCard, FormGrid, FormModal, FormSubmitRow, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { useI18n } from "@/lib/i18n";

export default function InventoryPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("Any status");
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("inventory")} subtitle={t("trackStock")} button={t("addItem")} onButtonClick={() => setIsFormOpen(true)} />
      <FilterBar className="lg:grid-cols-5">
        <TextField label="Search" placeholder="Item, SKU, or serial number" onInput={(event) => setQuery(event.currentTarget.value)} />
        <LookupSelectField label="Category" group="item-categories" prependOptions={[{ label: "All categories", value: "All categories" }]} onChange={(event) => setCategory(event.currentTarget.value)} />
        <LookupSelectField label="Stock status" group="stock-statuses" onChange={(event) => setStatus(event.currentTarget.value)} />
        <LookupSelectField label="Warehouse" group="warehouses" />
        <Button variant="secondary" className="self-end">Import CSV</Button>
      </FilterBar>
      <InventoryRows query={query} category={category} status={status} />
      <FormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="Add inventory item">
          <FormCard title="Add inventory item" description="Create a stock item with SKU, serial tracking, HSN, reorder level, and category-specific fields." action={<CloseFormButton onClick={() => setIsFormOpen(false)} />} asForm>
            <FormGrid columns={2}>
              <TextField label="Item name" required minLength={3} defaultValue="Cotton roll A-12" />
              <TextField label="SKU" required pattern="[A-Z0-9\\-]{2,}" helper="Use uppercase letters, numbers, and hyphen" defaultValue="A-12" />
              <TextField label="Serial number" required pattern="[A-Za-z0-9\\-]{4,}" helper="Unique serial, batch, or IMEI reference" defaultValue="TXT-A12-2026-0008" />
              <TextField label="HSN/SAC" required pattern="[0-9]{4,8}" helper="4 to 8 digits" defaultValue="5208" />
              <TextField label="Batch / IMEI group" pattern="[A-Za-z0-9\\-]{4,}" placeholder="Optional by category" />
              <DatePickerField label="Expiry / warranty" />
              <TextField label="Reorder level" required type="number" min={0} defaultValue="20" />
            </FormGrid>
            <FormSubmitRow>
              <Button type="submit">Save item</Button>
            </FormSubmitRow>
          </FormCard>
      </FormModal>
      <AiActionCard />
    </div>
  );
}
