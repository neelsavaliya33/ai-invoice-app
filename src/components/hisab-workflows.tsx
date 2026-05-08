"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Download, Landmark, Plus, ReceiptIndianRupee, Upload } from "lucide-react";
import { Badge, Button, Card, DataTable, EmptyState, SectionTitle } from "@/components/ui";
import {
  CheckboxCard,
  CloseFormButton,
  DatePickerField,
  FormCard,
  FormGrid,
  FormModal,
  FormSubmitRow,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { toast } from "@/components/toast";
import { cn, currency } from "@/lib/utils";

type SalesDocKind = "quotation" | "order" | "delivery-challan" | "invoice" | "credit-note" | "debit-note";
type PurchaseDocKind = "order" | "invoice" | "debit-note" | "credit-note";

const salesDocMeta: Record<SalesDocKind, { title: string; numberLabel: string; defaultNumber: string; emptyTitle: string; emptyDescription: string; cta: string }> = {
  quotation: {
    title: "New quotation",
    numberLabel: "Quotation number",
    defaultNumber: "QO-1",
    emptyTitle: "Create your first quotation",
    emptyDescription: "Prepare a customer quote with items, rate, discount, GST, and validity before converting it to an order or invoice.",
    cta: "Add new quotation",
  },
  order: {
    title: "New sale order",
    numberLabel: "Order number",
    defaultNumber: "SO-1",
    emptyTitle: "Create your first sale order",
    emptyDescription: "Record accepted customer orders, expected dispatch dates, item quantities, and payment terms.",
    cta: "Add new sale order",
  },
  "delivery-challan": {
    title: "New delivery challan",
    numberLabel: "Delivery challan number",
    defaultNumber: "DC-1",
    emptyTitle: "Create your first delivery challan",
    emptyDescription: "Move goods with a challan before invoicing, including dispatch location, item quantity, vehicle, and receiver details.",
    cta: "Add new delivery challan",
  },
  invoice: {
    title: "New sale invoice",
    numberLabel: "Invoice number",
    defaultNumber: "INV-1",
    emptyTitle: "Get started with creating your first sale invoice",
    emptyDescription: "Create GST-ready invoices with line items, due dates, discounts, round off, e-way bill readiness, and payment tracking.",
    cta: "Add new sale invoice",
  },
  "credit-note": {
    title: "New sale credit note",
    numberLabel: "Credit note number",
    defaultNumber: "SCN-1",
    emptyTitle: "You do not have any credit note",
    emptyDescription: "Use a sale credit note when invoice value is reduced because of returns, short supply, or a post-sale adjustment.",
    cta: "Add new sale credit note",
  },
  "debit-note": {
    title: "New sale debit note",
    numberLabel: "Debit note number",
    defaultNumber: "SDN-1",
    emptyTitle: "You do not have any debit note",
    emptyDescription: "Use a sale debit note when invoice value is increased because of additional goods, charges, or corrections.",
    cta: "Add new sale debit note",
  },
};

const purchaseDocMeta: Record<PurchaseDocKind, { title: string; numberLabel: string; defaultNumber: string; emptyTitle: string; emptyDescription: string; cta: string }> = {
  order: {
    title: "New purchase order",
    numberLabel: "Order number",
    defaultNumber: "PO-1",
    emptyTitle: "Create your first purchase order",
    emptyDescription: "Send purchase orders to suppliers with item requirements, expected rates, delivery notes, and GST treatment.",
    cta: "Add new purchase order",
  },
  invoice: {
    title: "New purchase invoice",
    numberLabel: "Invoice number",
    defaultNumber: "PINV-1",
    emptyTitle: "You do not have any purchase invoices yet",
    emptyDescription: "Record supplier bills, input GST, payable amount, internal notes, and item-level stock impact.",
    cta: "Add new purchase invoice",
  },
  "debit-note": {
    title: "New purchase debit note",
    numberLabel: "Debit note number",
    defaultNumber: "PDN-1",
    emptyTitle: "You do not have any purchase debit note",
    emptyDescription: "Use purchase debit notes for supplier returns or value reductions that reduce your payable.",
    cta: "Add new purchase debit note",
  },
  "credit-note": {
    title: "New purchase credit note",
    numberLabel: "Credit note number",
    defaultNumber: "PCN-1",
    emptyTitle: "You do not have any purchase credit note",
    emptyDescription: "Use purchase credit notes for supplier-side adjustments that increase payable or settle a billing correction.",
    cta: "Add new purchase credit note",
  },
};

function GstInfoBanner() {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-muted/50 p-3 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        Add GSTIN to create tax documents. You can continue in demo mode for unregistered businesses.
      </span>
      <span className="flex gap-2">
        <Button variant="secondary" className="h-9">Add GSTIN</Button>
        <Button variant="ghost" className="h-9">Got it</Button>
      </span>
    </div>
  );
}

function ItemsEditor({ purchaseReturn = false }: { purchaseReturn?: boolean }) {
  const headers = purchaseReturn ? ["Ind.", "Item", "Invoice number", "Return", "Qty", "Rate", "Amount", "Total"] : ["Ind.", "Item", "Qty", "Rate (W/O Tax)", "Discount", "Total"];
  return (
    <div className="rounded-2xl border bg-background">
      <div className="border-b px-4 py-3 text-sm font-bold">Items</div>
      <DataTable
        headers={headers}
        rows={[]}
        empty={
          <Button
            variant="secondary"
            onClick={() => toast({ tone: "success", title: "Item row added", description: "A sample line item was inserted in demo mode." })}
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        }
      />
    </div>
  );
}

function TotalsPanel({ payable = "Net amount" }: { payable?: string }) {
  return (
    <div className="ml-auto mt-5 grid w-full max-w-sm gap-3 text-sm">
      {["Basic amount", "Discount", "Round off"].map((label) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold">Rs. 0.00</span>
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between border-t pt-4 text-base">
        <span>{payable}</span>
        <span className="font-black">Rs. 0.00</span>
      </div>
    </div>
  );
}

export function SalesDocumentForm({ kind, onClose }: { kind: SalesDocKind; onClose?: () => void }) {
  const meta = salesDocMeta[kind];
  return (
    <FormCard title={meta.title} action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage={`${meta.title} created`}>
      <GstInfoBanner />
      <FormGrid columns={3}>
        <TextField label={meta.numberLabel} required placeholder={meta.defaultNumber} />
        {kind !== "quotation" ? <LookupSelectField label="Supply type" group="supply-types" required fallbackOptions={[{ value: "Regular", label: "Regular" }, { value: "SEZ", label: "SEZ" }]} /> : null}
        <DatePickerField label="Date" required />
        <LookupSelectField label="Bill to" group="customers" required fallbackOptions={[{ value: "Kavya Textiles", label: "Kavya Textiles" }, { value: "Mehta Traders", label: "Mehta Traders" }]} />
      </FormGrid>
      <div className="mt-5">
        <ItemsEditor />
      </div>
      <TotalsPanel payable={kind === "invoice" ? "Net payable" : "Net amount"} />
      <FormSubmitRow>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </FormSubmitRow>
    </FormCard>
  );
}

export function PurchaseDocumentForm({ kind, onClose }: { kind: PurchaseDocKind; onClose?: () => void }) {
  const meta = purchaseDocMeta[kind];
  return (
    <FormCard title={meta.title} action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage={`${meta.title} created`}>
      <GstInfoBanner />
      <FormGrid columns={3}>
        <DatePickerField label="Date" required />
        <TextField label={meta.numberLabel} required placeholder={meta.defaultNumber} />
        <LookupSelectField label={kind === "order" ? "Order to" : "Bill from"} group="customers" required fallbackOptions={[{ value: "Rang Fabrics", label: "Rang Fabrics" }, { value: "Apex Packaging", label: "Apex Packaging" }]} />
        <LookupSelectField label="Tax type" group="tax-types" required fallbackOptions={[{ value: "GST", label: "GST" }, { value: "No Tax", label: "No Tax" }]} />
        {kind === "invoice" ? <LookupSelectField label="Discount" group="discount-types" required fallbackOptions={[{ value: "Per item", label: "Per item" }, { value: "At bill level", label: "At bill level" }]} /> : null}
        {kind === "order" ? <TextField label="Seller reference" placeholder="RFQ-221" /> : null}
      </FormGrid>
      <div className="mt-5">
        <ItemsEditor purchaseReturn={kind !== "invoice" && kind !== "order"} />
      </div>
      <TextareaField label="Internal notes" placeholder="Supplier communication notes" fieldClassName="mt-5" />
      {kind === "order" ? <TextareaField label="Order notes" placeholder="Confirm rate and dispatch date before shipping." fieldClassName="mt-4" /> : null}
      <TotalsPanel payable="Net payable" />
      <FormSubmitRow>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create</Button>
      </FormSubmitRow>
    </FormCard>
  );
}

export function EmptyWorkflowPage({
  title,
  subtitle,
  cta,
  children,
}: {
  title: string;
  subtitle: string;
  cta: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title={title} subtitle={subtitle} action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />{cta}</Button>} />
      <EmptyState title={subtitle} description="No records are available in this demo workspace yet. Use the action below to open the complete workflow form." action={<Button onClick={() => setOpen(true)}>{cta}<ArrowRight className="h-4 w-4" /></Button>} />
      <FormModal open={open} onOpenChange={setOpen} title={title} className="max-w-6xl">
        {typeof children === "function" ? children(() => setOpen(false)) : children}
      </FormModal>
    </div>
  );
}

export function SalesDocumentPage({ kind }: { kind: SalesDocKind }) {
  const meta = salesDocMeta[kind];
  return (
    <EmptyWorkflowPage title={`Sales / ${meta.title.replace("New ", "")}`} subtitle={meta.emptyTitle} cta={meta.cta}>
      {(close) => <SalesDocumentForm kind={kind} onClose={close} />}
    </EmptyWorkflowPage>
  );
}

export function PurchaseDocumentPage({ kind }: { kind: PurchaseDocKind }) {
  const meta = purchaseDocMeta[kind];
  return (
    <EmptyWorkflowPage title={`Purchase / ${meta.title.replace("New ", "")}`} subtitle={meta.emptyTitle} cta={meta.cta}>
      {(close) => <PurchaseDocumentForm kind={kind} onClose={close} />}
    </EmptyWorkflowPage>
  );
}

export function SimpleIncomeExpensePage({ type }: { type: "Income" | "Expense" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title={`${type}s`} subtitle={`Track every ${type.toLowerCase()} entry with category, party or bank, amount, notes, and GST-ready audit detail.`} action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New {type.toLowerCase()}</Button>} />
      <EmptyState title={`No ${type.toLowerCase()} records found`} description={`Create your first ${type.toLowerCase()} entry to keep reports and ledgers updated.`} action={<Button onClick={() => setOpen(true)}>Add new {type.toLowerCase()}</Button>} />
      <FormModal open={open} onOpenChange={setOpen} title={`New ${type}`}>
        <FormCard title={`New ${type}`} action={<CloseFormButton onClick={() => setOpen(false)} />} asForm successMessage={`${type} saved`}>
          <FormGrid>
            <DatePickerField label="Date" required />
            <LookupSelectField label="Category" group={type === "Income" ? "income-categories" : "expense-categories"} required fallbackOptions={[{ value: type === "Income" ? "Sales service income" : "Transport", label: type === "Income" ? "Sales service income" : "Transport" }, { value: "Office", label: "Office" }]} />
            <LookupSelectField label="Contact or bank" group="bank-accounts" required fallbackOptions={[{ value: "Cash on hand", label: "Cash on hand" }, { value: "HDFC Current Account", label: "HDFC Current Account" }]} />
            <TextField label="Amount" required type="number" min={1} placeholder="12500" />
            <TextareaField label="Notes" placeholder={`Recorded ${type.toLowerCase()} for ledger and report workflow.`} fieldClassName="md:col-span-2" />
          </FormGrid>
          <FormSubmitRow><Button type="submit">Create</Button></FormSubmitRow>
        </FormCard>
      </FormModal>
    </div>
  );
}

export function BankTransfersPageContent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title="Bank transfers" subtitle="Move money between cash, bank, credit card, and wallet accounts with a clear audit trail." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New transfer</Button>} />
      <EmptyState title="No bank transfers yet" description="Record your first transfer between two bank or cash accounts." action={<Button onClick={() => setOpen(true)}>Add new bank transfer</Button>} />
      <FormModal open={open} onOpenChange={setOpen} title="New bank transfer">
        <FormCard title="New bank transfer" action={<CloseFormButton onClick={() => setOpen(false)} />} asForm successMessage="Bank transfer saved">
          <FormGrid>
            <DatePickerField label="Date" required />
            <LookupSelectField label="From bank" group="bank-accounts" required fallbackOptions={[{ value: "Cash on hand", label: "Cash on hand" }, { value: "HDFC Current Account", label: "HDFC Current Account" }]} />
            <LookupSelectField label="To bank" group="bank-accounts" required fallbackOptions={[{ value: "My bank account", label: "My bank account" }, { value: "My credit card", label: "My credit card" }]} />
            <TextField label="Amount" required type="number" min={1} placeholder="25000" />
            <TextareaField label="Notes" placeholder="Transfer recorded for cash and bank reconciliation." fieldClassName="md:col-span-2" />
          </FormGrid>
          <FormSubmitRow><Button type="submit">Create</Button></FormSubmitRow>
        </FormCard>
      </FormModal>
    </div>
  );
}

export function BlockedUntilTransactionsPage({ title, action }: { title: string; action: "Payment" | "Settlement" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title={title} subtitle={`${action}s are created against pending contact transactions so ledgers stay accurate.`} action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New {action.toLowerCase()}</Button>} />
      <EmptyState title={`No ${action.toLowerCase()}s posted yet`} description={`Create invoices, purchases, or opening balances first, then record the ${action.toLowerCase()} against those pending transactions.`} action={<Button onClick={() => setOpen(true)}>Add new {action.toLowerCase()}</Button>} />
      <FormModal open={open} onOpenChange={setOpen} title={`New ${action}`}>
        <Card className="p-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.75rem] bg-primary/10 text-primary">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-xl font-black">New {action}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Create {action}/receipt only when there are pending transactions for the contact. First create transactions, then record its {action.toLowerCase()}.
          </p>
          <Button className="mt-6" onClick={() => setOpen(false)}>Got it</Button>
        </Card>
      </FormModal>
    </div>
  );
}

export function ItemsPageContent() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title="Items" subtitle="Create product, service, serialized, and inventory-managed item masters." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New item</Button>} />
      <EmptyState title="No items found" description="Add product or service masters with HSN, unit, tax, sale price, opening stock, and inventory controls." action={<Button onClick={() => setOpen(true)}>Add new item</Button>} />
      <FormModal open={open} onOpenChange={setOpen} title="New item">
        <ItemMasterForm onClose={() => setOpen(false)} />
      </FormModal>
    </div>
  );
}

export function ItemMasterForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="New item" action={onClose ? <CloseFormButton onClick={onClose} /> : undefined} asForm successMessage="Item created">
      <FormGrid columns={2}>
        <LookupSelectField label="Item type" group="item-types" required fallbackOptions={[{ value: "Product", label: "Product" }, { value: "Service", label: "Service" }]} />
        <div className="grid gap-3">
          <CheckboxCard label="Manage inventory / stock" defaultChecked />
          <CheckboxCard label="Serialized product" description="Track serial, batch, or IMEI values." />
        </div>
        <TextField label="Name" required minLength={2} />
        <TextField label="HSN" pattern="[0-9]{4,8}" />
        <TextField label="Item code" placeholder="A-12" />
        <LookupSelectField label="Unit of measurement" group="units" required fallbackOptions={[{ value: "Pcs", label: "Pcs" }, { value: "Roll", label: "Roll" }]} />
        <LookupSelectField label="Tax category" group="gst-rates" required />
        <LookupSelectField label="Stock category" group="industries" required fallbackOptions={[{ value: "Textile", label: "Textile" }, { value: "Electronics", label: "Electronics" }]} />
        <TextareaField label="Default invoice description" placeholder="Shown on invoice for product warranty, batch, or item note." fieldClassName="md:col-span-2" />
        <TextField label="Sales price" required type="number" min={0} placeholder="1850" />
        <TextField label="Discount" type="number" min={0} placeholder="0" />
        <TextField label="Opening stock quantity" type="number" min={0} placeholder="20" />
        <TextField label="Cost per quantity" type="number" min={0} placeholder="1450" />
      </FormGrid>
      <FormSubmitRow><Button type="submit">Create</Button></FormSubmitRow>
    </FormCard>
  );
}

export function BankAccountsPageContent() {
  const [open, setOpen] = useState(false);
  const accounts = [
    ["Cash on hand", "Rs. 0.00", "Cash"],
    ["My bank account", "Rs. 0.00", "Bank"],
    ["My credit card", "Rs. 0.00", "Card"],
  ];
  return (
    <div className="space-y-6">
      <SectionTitle title="Bank accounts" subtitle="Manage cash, bank, credit card, and wallet accounts used across payments and reconciliation." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New account</Button>} />
      <div className="grid gap-4 md:grid-cols-3">
        {accounts.map(([name, balance, type]) => (
          <Card key={name} className="p-5">
            <div className="flex items-center gap-4">
              <Landmark className="h-8 w-8 text-muted-foreground" />
              <div>
                <h2 className="font-black">{name}</h2>
                <p className="mt-1 text-sm">{balance}</p>
              </div>
              <Badge className="ml-auto">{type}</Badge>
            </div>
          </Card>
        ))}
      </div>
      <FormModal open={open} onOpenChange={setOpen} title="New bank account">
        <FormCard title="New bank account" action={<CloseFormButton onClick={() => setOpen(false)} />} asForm successMessage="Bank account saved">
          <FormGrid>
            <LookupSelectField label="Account type" group="bank-account-types" required fallbackOptions={["Cash", "Bank", "Credit card", "Wallet"].map((value) => ({ value, label: value }))} />
            <TextField label="Account name" required minLength={2} placeholder="HDFC Current Account" />
            <TextField label="Opening balance" required type="number" placeholder="0" />
            <DatePickerField label="As of date" required />
          </FormGrid>
          <FormSubmitRow><Button type="submit">Create account</Button></FormSubmitRow>
        </FormCard>
      </FormModal>
    </div>
  );
}

export function CustomAccountsPageContent() {
  const [open, setOpen] = useState(false);
  const balanceSheet = ["Capital accounts", "Owner1", "Owner2", "Fixed assets", "My resident home", "Pali hill flat", "Security deposits", "Investments", "Equity", "Life insurance", "Loans"];
  const profitLoss = ["Depreciation", "Forex gain/loss", "Gain on sale of assets", "Indirect expense", "Interest paid", "Indirect income", "Interest income", "Loss on sale of assets", "Round off"];
  return (
    <div className="space-y-6">
      <SectionTitle title="Custom accounts" subtitle="Maintain balance sheet and profit loss ledgers with custom account groups." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New account</Button>} />
      <div className="grid gap-6 xl:grid-cols-2">
        {[["Balance Sheet", balanceSheet], ["Profit & Loss", profitLoss]].map(([title, rows]) => (
          <Card key={title as string} className="overflow-hidden">
            <div className="border-b p-4 font-black">{title as string}</div>
            <div className="divide-y">
              {(rows as string[]).map((row, index) => (
                <button key={row} className={cn("flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/60", index === 1 && "bg-primary/5")}>
                  <span>{row}</span>
                  <Badge>{index === 0 ? "Group" : "Ledger"}</Badge>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <FormModal open={open} onOpenChange={setOpen} title="New custom account">
        <FormCard title="New custom account" action={<CloseFormButton onClick={() => setOpen(false)} />} asForm successMessage="Custom account saved">
          <FormGrid>
            <TextField label="Account name" required minLength={2} placeholder="Owner capital" />
            <LookupSelectField label="Account group" group="accounts" required fallbackOptions={[{ value: "Capital accounts", label: "Capital accounts" }, { value: "Indirect expense", label: "Indirect expense" }]} />
            <LookupSelectField label="Report section" group="report-sections" required fallbackOptions={[{ value: "Balance Sheet", label: "Balance Sheet" }, { value: "Profit & Loss", label: "Profit & Loss" }]} />
            <TextField label="Opening balance" type="number" placeholder="0" />
          </FormGrid>
          <FormSubmitRow><Button type="submit">Create account</Button></FormSubmitRow>
        </FormCard>
      </FormModal>
    </div>
  );
}

export function SubscriptionPageContent() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Subscription" subtitle="Review current plan, trial status, plan limits, and upgrade actions." />
      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-black">Current plan</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-bold">Professional <Badge tone="amber">Trial active</Badge></span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expires on</span><span className="font-bold">20 May 2026</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">AI credits</span><span className="font-bold">784 / 800 used</span></div>
          </div>
          <Button className="mt-6">Buy plan</Button>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-black">Usage included</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["3 companies", "5 users", "800 AI credits/month", "150 e-way bills"].map((item) => (
              <div key={item} className="rounded-2xl border bg-background p-4 font-semibold">{item}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ContactImportForm({ onClose }: { onClose?: () => void }) {
  return (
    <FormCard title="Import contacts" action={onClose ? <CloseFormButton onClick={onClose} /> : undefined}>
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5 text-sm">
          {[
            ["Step 1", "Download the sample Excel file."],
            ["Step 2", "Update it with your contact details."],
            ["Step 3", "Upload the updated .xls or .xlsx file."],
            ["Step 4", "Review uploaded contacts and import."],
          ].map(([step, text]) => (
            <div key={step}>
              <p className="font-black uppercase">{step}</p>
              <p className="mt-1 text-muted-foreground">{text}</p>
            </div>
          ))}
          <Button variant="secondary"><Download className="h-4 w-4" />Download sample file</Button>
        </div>
        <button className="grid min-h-[280px] place-items-center rounded-2xl border border-dashed bg-background p-8 text-center" onClick={() => toast({ tone: "info", title: "Upload simulated", description: "File upload is demo-only in this frontend build." })}>
          <span>
            <Upload className="mx-auto h-10 w-10 text-primary" />
            <span className="mt-4 block font-bold">Drag your file here</span>
            <span className="mt-2 block text-sm text-muted-foreground">Upload Excel .xls or .xlsx file</span>
          </span>
        </button>
      </div>
    </FormCard>
  );
}
