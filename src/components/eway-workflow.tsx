"use client";

import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import {
  DatePickerField,
  FilterBar,
  CloseFormButton,
  FormCard,
  FormGrid,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { ewayBills, invoices } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { currency } from "@/lib/utils";
import { CheckCircle2, Download, FileText, Plus, Send, ShieldCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "./toast";

const selectedInvoice = invoices[0];
const generatedNumber = "EWB-2426-0021";

export function EwayHeader({ onActionClick }: { onActionClick?: () => void }) {
  const { t } = useI18n();
  return (
    <SectionTitle
      title={t("ewayBills")}
      subtitle={t("ewaySubtitle")}
      action={
        <Button onClick={onActionClick}>
          <Plus className="h-4 w-4" />
          {t("generateEwayBill")}
        </Button>
      }
    />
  );
}

export function EwayKpis() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        [t("generatedThisMonth"), "18", "green"],
        [t("readyToSubmit"), "3", "blue"],
        [t("draftsMissingVehicle"), "2", "amber"],
        [t("expiringSoon"), "1", "red"],
      ].map(([label, value, tone]) => (
        <Card key={label} className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <Badge className="mt-4" tone={tone as never}>{t("transportLive")}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function EwayFilters({ query, status, onQueryChange, onStatusChange }: { query?: string; status?: string; onQueryChange?: (value: string) => void; onStatusChange?: (value: string) => void }) {
  const { t } = useI18n();
  return (
    <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
      <TextField label={t("searchPlaceholder")} value={query} placeholder="E-way bill, invoice, vehicle" onInput={(event) => onQueryChange?.(event.currentTarget.value)} />
      <LookupSelectField label={t("status")} group="eway-statuses" value={status} defaultValue="All" prependOptions={[{ label: "All", value: "All" }]} onChange={(event) => onStatusChange?.(event.currentTarget.value)} />
      <DatePickerField label={t("dispatchDate")} />
      <LookupSelectField label={t("supplyType")} group="supply-types" defaultValue="Outward" />
      <Button variant="secondary" className="self-end">{t("applyFilters")}</Button>
    </FilterBar>
  );
}

export function EwayTable({ query = "", status = "All", extraBills = [] }: { query?: string; status?: string; extraBills?: typeof ewayBills }) {
  const { t } = useI18n();
  const rows = [...ewayBills, ...extraBills].filter((bill) => {
    const matchesQuery = `${bill.id} ${bill.invoice} ${bill.customer} ${bill.vehicle}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || bill.status === status;
    return matchesQuery && matchesStatus;
  });
  return (
    <DataTable
      headers={[t("ewayBill"), t("invoice"), t("customer"), t("vehicle"), t("distance"), t("amount"), t("validUntil"), t("status")]}
      rows={rows.map((bill) => [
        <span key="id" className="font-semibold">{bill.id}</span>,
        bill.invoice,
        bill.customer,
        bill.vehicle,
        `${bill.distance} km`,
        currency(bill.amount),
        bill.validUntil,
        <Badge key="status" tone={bill.status === "Generated" ? "green" : bill.status === "Ready" ? "blue" : "amber"}>{bill.status}</Badge>,
      ])}
    />
  );
}

export function EwayGenerator({ onDraftCreated, onClose }: { onDraftCreated?: (bill: (typeof ewayBills)[number]) => void; onClose?: () => void }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState({
    id: generatedNumber,
    invoice: selectedInvoice.id,
    customer: selectedInvoice.customer,
    vehicle: "GJ05AB1234",
    distance: 265,
    amount: selectedInvoice.amount,
  });
  const previewRows = useMemo(() => [
    [t("invoice"), draft.invoice],
    [t("party"), draft.customer],
    [t("value"), currency(draft.amount)],
    [t("transport"), `Road, ${draft.distance} km`],
    [t("vehicle"), draft.vehicle],
    [t("validUntil"), "08 May 2026"],
  ], [draft, t]);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <FormCard
        title={t("directEwayGeneration")}
        description={t("directEwayDescription")}
        action={onClose ? <CloseFormButton onClick={onClose} /> : undefined}
        asForm
        successMessage="E-way draft generated"
        onValidSubmit={(values) => {
          const nextDraft = {
            id: generatedNumber,
            invoice: values["document-number"] || selectedInvoice.id,
            customer: values["ship-to"] || selectedInvoice.customer,
            transporter: values["transporter-name"] || "Surat Transport Co.",
            vehicle: values["vehicle-number"] || "GJ05AB1234",
            distance: Number(values["distance-km"] || 265),
            validUntil: "08 May 2026",
            status: "Draft",
            amount: Number(values["total-invoice-value"] || selectedInvoice.amount),
          };
          setDraft(nextDraft);
          onDraftCreated?.(nextDraft);
        }}
      >
        <FormGrid columns={3}>
          <SelectField label={t("invoice")} required defaultValue={selectedInvoice.id} options={invoices.map((invoice) => `${invoice.id} - ${invoice.customer}`)} />
          <LookupSelectField label={t("supplyType")} group="supply-types" required defaultValue="Outward" fallbackOptions={[{ label: "Outward", value: "Outward" }, { label: "Inward", value: "Inward" }, { label: "Job work", value: "Job work" }, { label: "Sales return", value: "Sales return" }, { label: "Exhibition", value: "Exhibition" }]} />
          <LookupSelectField label={t("subType")} group="eway-sub-types" required defaultValue="Supply" />
          <TextField label={t("fromGstin")} required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue="24ABCDE1234F1Z5" />
          <TextField label={t("toGstin")} required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue="24ABCDE1234F1Z5" />
          <LookupSelectField label={t("documentType")} group="document-types" required defaultValue="Tax invoice" fallbackOptions={[{ label: "Tax invoice", value: "Tax invoice" }, { label: "Bill of supply", value: "Bill of supply" }, { label: "Delivery challan", value: "Delivery challan" }, { label: "Credit note", value: "Credit note" }]} />
          <TextField label={t("documentNumber")} required pattern="INV-[0-9]{4,}" defaultValue={selectedInvoice.id} />
          <DatePickerField label={t("documentDate")} required defaultValue="2026-05-04" />
          <TextField label={t("taxableValue")} required type="number" min={1} defaultValue="69831" />
          <TextField label={t("cgstAmount")} required type="number" min={0} defaultValue="6284" />
          <TextField label={t("sgstAmount")} required type="number" min={0} defaultValue="6285" />
          <TextField label={t("totalInvoiceValue")} required type="number" min={1} defaultValue={String(selectedInvoice.amount)} />
          <TextField label={t("dispatchFrom")} required minLength={5} defaultValue="Ring Road Textile Market, Surat" />
          <TextField label={t("shipTo")} required minLength={5} defaultValue="Kavya Textiles, Ahmedabad" />
          <TextField label={t("distanceKm")} required type="number" min={1} max={4000} defaultValue="265" />
          <LookupSelectField label={t("transportMode")} group="transport-modes" required defaultValue="Road" />
          <TextField label={t("transporterName")} required minLength={3} defaultValue="Surat Transport Co." />
          <TextField label={t("transporterId")} pattern="[0-9A-Z]{5,15}" helper="Optional GST transporter ID" placeholder="24TRNSP1234Z1" />
          <TextField label={t("vehicleNumber")} required pattern="[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}" helper="Example: GJ05AB1234" defaultValue="GJ05AB1234" />
          <DatePickerField label={t("dispatchDate")} required defaultValue="2026-05-04" />
          <TextareaField label={t("goodsDescription")} required minLength={10} defaultValue="Cotton roll A-12 and denim bundle blue for textile supply." />
        </FormGrid>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="submit">
            <Truck className="h-4 w-4" />
            {t("generateDraft")}
          </Button>
          <Button variant="secondary" onClick={() => toast({ tone: "success", title: "GST fields validated", description: "GSTIN, vehicle number, distance, and invoice value match demo rules." })}>
            <ShieldCheck className="h-4 w-4" />
            {t("validateGstFields")}
          </Button>
        </div>
      </FormCard>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("generatedDraft")}</p>
              <h2 className="mt-1 text-2xl font-bold">{draft.id}</h2>
            </div>
            <Badge tone="blue">Ready</Badge>
          </div>
          <div className="mt-5 space-y-3 rounded-2xl bg-background p-4 text-sm">
            {previewRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-right font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <Button variant="secondary" onClick={() => toast({ tone: "info", title: "Live portal disabled", description: "Add authenticated GST/e-way bill API credentials before live submission." })}>
              <Send className="h-4 w-4" />
              {t("submitToEwayPortal")}
            </Button>
            <Button variant="secondary" onClick={() => toast({ tone: "success", title: "E-way export prepared", description: `${draft.id} JSON/PDF package is ready in demo mode.` })}>
              <Download className="h-4 w-4" />
              {t("downloadJsonPdf")}
            </Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            {t("demoModeEway")}
          </p>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">{t("aiTransportCheck")}</h3>
          <div className="mt-4 space-y-3">
            {[
              "Vehicle number format is valid for Gujarat.",
              "Invoice value is above common e-way bill threshold.",
              "Distance gives 4-day estimated validity for road transport.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-muted p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function EwayHelpCard() {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-bold">{t("requiredBeforeLiveFiling")}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {t("requiredBeforeLiveFilingBody")}
      </p>
    </Card>
  );
}
