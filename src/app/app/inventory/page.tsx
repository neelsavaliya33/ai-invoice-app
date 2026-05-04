"use client";

import { AiActionCard, InventoryRows, PageHeaderActions } from "@/components/workflow";
import { Button } from "@/components/ui";
import { FilterBar, FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { useI18n } from "@/lib/i18n";

export default function InventoryPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeaderActions title={t("inventory")} subtitle={t("trackStock")} button={t("addItem")} />
      <FilterBar className="lg:grid-cols-5">
        <TextField label="Search" placeholder="Item or SKU" />
        <SelectField label="Category" options={["All categories", "Textile", "Electronics"]} />
        <SelectField label="Stock status" options={["Any status", "Low stock", "Healthy"]} />
        <SelectField label="Warehouse" options={["All warehouses", "Main", "Shop"]} />
        <Button variant="secondary" className="self-end">Import CSV</Button>
      </FilterBar>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <InventoryRows />
        <FormCard title="Item form fields" description="Reusable item form for inventory create/edit flows." asForm>
          <FormGrid columns={1}>
            <TextField label="Item name" required minLength={3} defaultValue="Cotton roll A-12" />
            <TextField label="SKU" required pattern="[A-Z0-9\\-]{2,}" helper="Use uppercase letters, numbers, and hyphen" defaultValue="A-12" />
            <TextField label="HSN/SAC" required pattern="[0-9]{4,8}" helper="4 to 8 digits" defaultValue="5208" />
            <TextField label="Batch / serial / IMEI" pattern="[A-Za-z0-9\\-]{4,}" placeholder="Optional by category" />
            <TextField label="Expiry / warranty" type="date" />
            <TextField label="Reorder level" required type="number" min={0} defaultValue="20" />
            <Button type="submit">Save item</Button>
          </FormGrid>
        </FormCard>
      </div>
      <AiActionCard />
    </div>
  );
}
