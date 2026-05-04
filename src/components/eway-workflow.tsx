"use client";

import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import {
  DatePickerField,
  FilterBar,
  FormCard,
  FormGrid,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form-kit";
import { ewayBills, invoices } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { currency } from "@/lib/utils";
import { CheckCircle2, Download, FileText, Plus, Send, ShieldCheck, Truck } from "lucide-react";

const selectedInvoice = invoices[0];
const generatedNumber = "EWB-2426-0021";

export function EwayHeader() {
  const { t } = useI18n();
  return (
    <SectionTitle
      title={t("ewayBills")}
      subtitle={t("ewaySubtitle")}
      action={
        <Button>
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

export function EwayFilters() {
  const { t } = useI18n();
  return (
    <FilterBar className="lg:grid-cols-[1fr_160px_160px_160px_auto]">
      <TextField label={t("searchPlaceholder")} placeholder="E-way bill, invoice, vehicle" />
      <SelectField label={t("status")} defaultValue="All" options={["All", "Draft", "Ready", "Generated", "Expired"]} />
      <DatePickerField label={t("dispatchDate")} />
      <SelectField label={t("supplyType")} defaultValue="Outward" options={["Outward", "Inward", "Job work", "Sales return"]} />
      <Button variant="secondary" className="self-end">{t("applyFilters")}</Button>
    </FilterBar>
  );
}

export function EwayTable() {
  const { t } = useI18n();
  return (
    <DataTable
      headers={[t("ewayBill"), t("invoice"), t("customer"), t("vehicle"), t("distance"), t("amount"), t("validUntil"), t("status")]}
      rows={ewayBills.map((bill) => [
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

export function EwayGenerator() {
  const { t } = useI18n();
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <FormCard
        title={t("directEwayGeneration")}
        description={t("directEwayDescription")}
        asForm
      >
        <FormGrid columns={3}>
          <SelectField label={t("invoice")} required defaultValue={selectedInvoice.id} options={invoices.map((invoice) => `${invoice.id} - ${invoice.customer}`)} />
          <SelectField label={t("supplyType")} required defaultValue="Outward" options={["Outward", "Inward", "Job work", "Sales return", "Exhibition"]} />
          <SelectField label={t("subType")} required defaultValue="Supply" options={["Supply", "Export", "Recipient not known", "SKD/CKD", "Line sales"]} />
          <TextField label={t("fromGstin")} required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue="24ABCDE1234F1Z5" />
          <TextField label={t("toGstin")} required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue="24ABCDE1234F1Z5" />
          <SelectField label={t("documentType")} required defaultValue="Tax invoice" options={["Tax invoice", "Bill of supply", "Delivery challan", "Credit note"]} />
          <TextField label={t("documentNumber")} required pattern="INV-[0-9]{4,}" defaultValue={selectedInvoice.id} />
          <DatePickerField label={t("documentDate")} required defaultValue="2026-05-04" />
          <TextField label={t("taxableValue")} required type="number" min={1} defaultValue="69831" />
          <TextField label={t("cgstAmount")} required type="number" min={0} defaultValue="6284" />
          <TextField label={t("sgstAmount")} required type="number" min={0} defaultValue="6285" />
          <TextField label={t("totalInvoiceValue")} required type="number" min={1} defaultValue={String(selectedInvoice.amount)} />
          <TextField label={t("dispatchFrom")} required minLength={5} defaultValue="Ring Road Textile Market, Surat" />
          <TextField label={t("shipTo")} required minLength={5} defaultValue="Kavya Textiles, Ahmedabad" />
          <TextField label={t("distanceKm")} required type="number" min={1} max={4000} defaultValue="265" />
          <SelectField label={t("transportMode")} required defaultValue="Road" options={["Road", "Rail", "Air", "Ship"]} />
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
          <Button variant="secondary">
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
              <h2 className="mt-1 text-2xl font-bold">{generatedNumber}</h2>
            </div>
            <Badge tone="blue">Ready</Badge>
          </div>
          <div className="mt-5 space-y-3 rounded-2xl bg-background p-4 text-sm">
            {[
              [t("invoice"), selectedInvoice.id],
              [t("party"), selectedInvoice.customer],
              [t("value"), currency(selectedInvoice.amount)],
              [t("transport"), "Road, 265 km"],
              [t("vehicle"), "GJ05AB1234"],
              [t("validUntil"), "08 May 2026"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-right font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <Button>
              <Send className="h-4 w-4" />
              {t("submitToEwayPortal")}
            </Button>
            <Button variant="secondary">
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
