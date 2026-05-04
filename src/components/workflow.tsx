import { Badge, Button, Card, DataTable, Input, Select, SectionTitle } from "@/components/ui";
import { DatePickerField, FormActions, FormCard, FormGrid, SelectField, TextareaField, TextField } from "@/components/form-kit";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { currency } from "@/lib/utils";
import { customers, inventory, invoices, reports, users } from "@/lib/data";
import { ArrowUpRight, Copy, Download, FileDown, MoreHorizontal, Pencil, Plus, Send, WandSparkles } from "lucide-react";

function RowOptions({ type = "record" }: { type?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0" aria-label={`${type} options`}>
          <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{type} options</DropdownMenuLabel>
        <DropdownMenuItem><Pencil className="h-5 w-5 shrink-0" aria-hidden="true" /> Edit</DropdownMenuItem>
        <DropdownMenuItem><Copy className="h-5 w-5 shrink-0" aria-hidden="true" /> Duplicate</DropdownMenuItem>
        <DropdownMenuItem><Download className="h-5 w-5 shrink-0" aria-hidden="true" /> Export</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function KpiGrid() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {[
        [t("salesThisMonth"), "INR 9.42L", "green"],
        [t("receivables"), "INR 2.81L", "blue"],
        [t("inventoryValue"), "INR 6.18L", "violet"],
        [t("overdueInvoices"), "18", "red"],
        [t("aiActions"), "7 ready", "amber"],
      ].map(([label, value, tone]) => (
        <Card key={label} className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <Badge className="mt-4" tone={tone as never}>+12% insight</Badge>
        </Card>
      ))}
    </div>
  );
}

export function InvoiceRows() {
  return (
    <DataTable
      headers={["Invoice", "Customer", "Status", "Due date", "Amount", "Actions"]}
      rows={invoices.map((invoice) => [
        <span key="id" className="font-semibold">{invoice.id}</span>,
        invoice.customer,
        <Badge key="status" tone={invoice.status === "Overdue" ? "red" : invoice.status === "Paid" ? "green" : invoice.status === "Draft" ? "amber" : "blue"}>{invoice.status}</Badge>,
        invoice.dueDate,
        currency(invoice.amount),
        <RowOptions key="action" type="Invoice" />,
      ])}
    />
  );
}

export function CustomerRows() {
  return (
    <DataTable
      headers={["Customer", "Type", "GSTIN", "Contact", "Balance", "Status", "Options"]}
      rows={customers.map((customer) => [
        <span key="name" className="font-semibold">{customer.name}</span>,
        customer.type,
        customer.gstin,
        customer.contact,
        currency(customer.balance),
        <Badge key="status" tone={customer.status === "Overdue" ? "red" : customer.status === "Paid" ? "green" : "blue"}>{customer.status}</Badge>,
        <RowOptions key="options" type="Customer" />,
      ])}
    />
  );
}

export function InventoryRows() {
  return (
    <DataTable
      headers={["SKU", "Item", "Category", "Stock", "Reorder", "Value", "Status", "Options"]}
      rows={inventory.map((item) => [
        <span key="sku" className="font-semibold">{item.sku}</span>,
        item.name,
        item.category,
        `${item.stock} ${item.unit}`,
        `${item.reorder} ${item.unit}`,
        currency(item.stock * item.purchase),
        <Badge key="status" tone={item.status === "Low stock" || item.status === "Reorder" ? "amber" : "green"}>{item.status}</Badge>,
        <RowOptions key="options" type="Item" />,
      ])}
    />
  );
}

export function UserRows() {
  return (
    <DataTable
      headers={["User", "Email", "Role", "Status", "Last active", "Access", "Options"]}
      rows={users.map((user) => [
        <span key="name" className="font-semibold">{user.name}</span>,
        user.email,
        <Badge key="role" tone="violet">{user.role}</Badge>,
        <Badge key="status" tone={user.status === "Active" ? "green" : "amber"}>{user.status}</Badge>,
        user.active,
        user.scope,
        <RowOptions key="options" type="User" />,
      ])}
    />
  );
}

export function AiActionCard() {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <div className="rounded-2xl bg-accent/15 p-2 text-accent">
          <WandSparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{t("aiCopilot")}</h3>
          <p className="text-xs text-muted-foreground">{t("suggestedAction")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Draft invoice", "Find overdue", "Stock risks", "Explain report"].map((prompt) => (
          <Badge key={prompt} tone="violet">{prompt}</Badge>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("heroAiInsight")}
      </p>
      <Button className="mt-5 w-full">{t("applySuggestion")}</Button>
    </Card>
  );
}

export function InvoiceForm() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <FormCard title="AI Invoice Draft" description="Turn plain English into editable invoice fields." asForm>
          <div className="mb-4 flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-accent" />
            <h2 className="font-bold">Prompt builder</h2>
          </div>
          <TextareaField label="Invoice prompt" required minLength={20} placeholder="Describe the invoice you want to create..." defaultValue="Create invoice for Kavya Textiles for 20 cotton rolls and 12 blue denim bundles with 18% GST." />
          <div className="mt-3 flex flex-wrap gap-2">
            {["Textile invoice", "Mobile sale", "Service retainer", "Rental bill"].map((chip) => <Badge key={chip}>{chip}</Badge>)}
          </div>
          <Button type="submit" className="mt-4">Generate Draft</Button>
        </FormCard>

        <FormCard title="Customer Details" description="Reusable customer identity, GST, contact, address, and credit fields." asForm>
          <FormGrid>
            <SelectField label="Customer" required defaultValue="Kavya Textiles" options={["Kavya Textiles", "Mehta Traders"]} />
            <TextField label="GSTIN" required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" helper="15-character GSTIN format" defaultValue="24ABCDE1234F1Z5" />
            <SelectField label="Customer type" required defaultValue="Textile" options={["Textile", "Retail"]} />
            <TextField label="Contact person" required minLength={3} defaultValue="Rohan Shah" />
            <TextField label="Phone number" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" helper="Use Indian mobile format, e.g. +91 98765 43210" defaultValue="+91 98765 43210" />
            <TextField label="Email" required type="email" defaultValue="accounts@kavyatextiles.in" />
            <TextField label="Billing address" required minLength={8} defaultValue="Ring Road Textile Market" />
            <TextField label="City / State" required minLength={4} defaultValue="Surat, Gujarat" />
            <TextField label="Credit limit" required pattern="^INR\\s?[0-9,]+$" helper="Format: INR 2,00,000" defaultValue="INR 2,00,000" />
            <SelectField label="Payment terms" required defaultValue="Net 7" options={["Net 7", "Net 15", "Due on receipt"]} />
          </FormGrid>
        </FormCard>

        <FormCard title="Invoice Details" description="Operational fields for tax, transport, references, and due dates." asForm>
          <FormGrid columns={3}>
            <TextField label="Invoice number" required pattern="INV-[0-9]{4,}" helper="Format: INV-1053" defaultValue="INV-1053" />
            <DatePickerField label="Invoice date" required defaultValue="2026-05-04" />
            <DatePickerField label="Due date" required defaultValue="2026-05-11" />
            <SelectField label="Place of supply" required defaultValue="Gujarat" options={["Gujarat", "Maharashtra"]} />
            <SelectField label="Tax type" required defaultValue="GST" options={["GST", "IGST", "No tax"]} />
            <TextField label="Salesperson" required minLength={3} defaultValue="Priya Patel" />
            <TextField label="PO number" pattern="[A-Za-z0-9\\-/]{3,}" placeholder="Optional" />
            <TextField label="E-way bill" pattern="[0-9]{12}" helper="12 digits when provided" placeholder="Optional" />
            <TextField label="Vehicle number" pattern="[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}" helper="Example: GJ05AB1234" placeholder="Optional" />
          </FormGrid>
        </FormCard>

        <FormCard title="Line Items" description="Reusable editable table container for product, service, and category fields." action={<Button variant="secondary"><Plus className="h-4 w-4" /> Add item</Button>}>
          <DataTable
            headers={["Item", "HSN", "Qty", "Rate", "GST", "Total"]}
            rows={[
              ["Cotton roll A-12", "5208", "20 Roll", "INR 1,850", "18%", "INR 43,660"],
              ["Denim bundle blue", "6203", "12 Bundle", "INR 2,450", "18%", "INR 34,692"],
            ]}
          />
        </FormCard>

        <FormCard title="Payment, Notes & Terms" description="Shared payment method, reminder, terms, and note fields." asForm>
          <FormGrid>
            <SelectField label="Payment method" required options={["UPI", "Bank transfer", "Cash"]} />
            <TextField label="UPI ID" required pattern="[a-zA-Z0-9.\\-_]{2,}@[a-zA-Z]{2,}" helper="Format: name@bank" defaultValue="ledgerai@upi" />
            <TextField label="Advance received" required pattern="^INR\\s?[0-9,]+$" defaultValue="INR 0" />
            <DatePickerField label="Reminder date" required defaultValue="2026-05-10" />
            <TextareaField label="Customer note" required minLength={8} defaultValue="Thank you for your business." />
            <TextareaField label="Terms" required minLength={15} defaultValue="Payment due within 7 days. Goods once sold will not be returned." />
          </FormGrid>
          <FormActions primary="Save invoice details" secondary="Reset" />
        </FormCard>
      </div>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Invoice Preview</h2>
          <div className="mt-6 space-y-4 rounded-2xl bg-background p-5">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">LedgerAI Demo Co.</p>
                <p className="text-sm text-muted-foreground">GSTIN 24ABCDE1234F1Z5</p>
              </div>
              <Badge tone="amber">Draft</Badge>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold">Kavya Textiles</p>
              <p className="text-sm text-muted-foreground">Due 11 May 2026</p>
            </div>
            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>INR 66,400</span></div>
              <div className="flex justify-between"><span>GST</span><span>INR 11,952</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>INR 78,352</span></div>
            </div>
            <div className="grid h-28 place-items-center rounded-2xl border border-dashed text-sm text-muted-foreground">Payment QR</div>
          </div>
          <div className="mt-5 grid gap-3">
            <Button><Send className="h-4 w-4" /> Save and send</Button>
            <Button variant="secondary"><FileDown className="h-4 w-4" /> Download PDF</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ReportCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {reports.map((report) => {
        const Icon = report.icon;
        return (
          <Card key={report.title} className="p-5">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-bold">{report.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{report.value}</p>
          </Card>
        );
      })}
    </div>
  );
}

export function PageHeaderActions({ title, subtitle, button }: { title: string; subtitle: string; button: string }) {
  return <SectionTitle title={title} subtitle={subtitle} action={<Button><Plus className="h-4 w-4" /> {button}</Button>} />;
}

export function ActivityCard() {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <h3 className="font-bold">{t("todayActivity")}</h3>
      <div className="mt-4 space-y-3">
        {["Invoice INV-1048 reminder drafted", "Stock alert raised for Cotton roll A-12", "Priya exported GST summary"].map((activity) => (
          <div key={activity} className="flex items-center justify-between rounded-2xl bg-muted p-3 text-sm">
            <span>{activity}</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </Card>
  );
}
