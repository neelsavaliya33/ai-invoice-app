"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  CalendarClock,
  ClipboardList,
  Download,
  FileSpreadsheet,
  Landmark,
  ReceiptIndianRupee,
  Scale,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AiActionCard } from "@/components/workflow";
import { Badge, Button, Card, DataTable, SectionTitle } from "@/components/ui";
import { DatePickerField, FilterBar, FormModal } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { customers, expenses, inventory, invoices, purchases } from "@/lib/data";
import { currency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { ReportConfigForm } from "@/components/workflow-actions";

type ReportTone = "teal" | "green" | "amber" | "violet";
type ReportDefinition = {
  title: string;
  description: string;
  tone: ReportTone;
  icon: LucideIcon;
};
type ReportGroup = {
  title: string;
  reports: ReportDefinition[];
};

const reportGroups: ReportGroup[] = [
  {
    title: "Financial statements",
    reports: [
      { title: "Profit Loss", description: "Revenue, expense, margin, and net profit view.", tone: "teal", icon: TrendingUp },
      { title: "Balance Sheet", description: "Assets, liabilities, equity, and balances.", tone: "teal", icon: Scale },
      { title: "Statement", description: "Account statement for customers, vendors, and ledgers.", tone: "violet", icon: FileSpreadsheet },
      { title: "Income", description: "Income by customer, category, item, and period.", tone: "amber", icon: TrendingUp },
      { title: "Expense", description: "Expense category, vendor, GST, and payment status.", tone: "green", icon: TrendingDown },
    ],
  },
  {
    title: "Sales and purchase",
    reports: [
      { title: "Sale Detail", description: "Invoice-wise sales, tax, item, and customer detail.", tone: "teal", icon: ReceiptIndianRupee },
      { title: "Sale Summary", description: "Daily, monthly, customer, and taxable sales totals.", tone: "green", icon: TrendingUp },
      { title: "Purchase Detail", description: "Supplier bills, input GST, and payable tracking.", tone: "amber", icon: ClipboardList },
      { title: "Purchase Summary", description: "Supplier, category, tax, and period-wise purchase totals.", tone: "amber", icon: ClipboardList },
      { title: "Item By Contact", description: "Items sold or purchased by each contact.", tone: "violet", icon: Users },
    ],
  },
  {
    title: "Inventory and contacts",
    reports: [
      { title: "Inventory Detail", description: "SKU, serial number, stock, reorder, and valuation.", tone: "green", icon: Boxes },
      { title: "Stock", description: "Current stock quantity, value, low-stock, and slow movers.", tone: "teal", icon: Boxes },
      { title: "Contact Payable", description: "Supplier-wise payable aging and due amount.", tone: "green", icon: Landmark },
      { title: "Contact Receivables", description: "Customer-wise receivable aging and overdue risk.", tone: "teal", icon: Users },
      { title: "Purchase by Item", description: "Item-wise purchase quantity, value, and tax.", tone: "green", icon: Boxes },
      { title: "Purchase by Contact", description: "Supplier-wise purchase movement and payable effect.", tone: "violet", icon: Users },
      { title: "Purchase by Category", description: "Category-wise purchase mix and input GST view.", tone: "amber", icon: Boxes },
      { title: "Sale by Item", description: "Item-wise sale quantity, margin, and tax.", tone: "teal", icon: Boxes },
      { title: "Sale by Contact", description: "Customer-wise sales and collection status.", tone: "violet", icon: Users },
      { title: "Sale by Category", description: "Category-wise sale mix and revenue trends.", tone: "green", icon: Boxes },
    ],
  },
  {
    title: "GST and tax",
    reports: [
      { title: "GSTR 1 Report", description: "Outward supply summary for GST return preparation.", tone: "violet", icon: FileSpreadsheet },
      { title: "GSTR 3B Report", description: "Output GST, input GST, and payable summary.", tone: "amber", icon: FileSpreadsheet },
      { title: "TDS Report", description: "TDS deductions, parties, certificates, and due dates.", tone: "teal", icon: Landmark },
    ],
  },
];

const allReports = reportGroups.flatMap((group) => group.reports);

function reportToneClass(tone: ReportTone, active: boolean) {
  const base = {
    teal: "border-cyan-500/25 bg-cyan-950/25 text-cyan-50 dark:bg-cyan-950/35",
    green: "border-emerald-500/25 bg-emerald-950/25 text-emerald-50 dark:bg-emerald-950/35",
    amber: "border-amber-500/25 bg-amber-950/25 text-amber-50 dark:bg-amber-950/35",
    violet: "border-violet-500/25 bg-violet-950/25 text-violet-50 dark:bg-violet-950/35",
  }[tone];

  return cn(
    base,
    active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
  );
}

export default function ReportsPage() {
  const { t } = useI18n();
  const [activeReport, setActiveReport] = useState("Profit Loss");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const selectedReport = allReports.find((report) => report.title === activeReport) ?? allReports[0];
  const Icon = selectedReport.icon;

  const summary = useMemo(() => {
    const sales = invoices.reduce((total, invoice) => total + invoice.amount, 0);
    const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
    const purchaseTotal = purchases.reduce((total, purchase) => total + purchase.amount, 0);
    const stockValue = inventory.reduce((total, item) => total + item.stock * item.purchase, 0);
    const receivables = invoices.filter((invoice) => invoice.status !== "Paid").reduce((total, invoice) => total + invoice.amount, 0);
    const payables = purchases.reduce((total, purchase) => total + purchase.payable, 0);

    return { sales, expenseTotal, purchaseTotal, stockValue, receivables, payables };
  }, []);

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("reports")}
        subtitle="Wide array of reports to manage every aspect of your business, from balance sheet and profit loss to sales summaries, inventory details, GST reports, and contact aging."
        action={
          <Button onClick={() => setIsConfigOpen(true)}>
            <Download className="h-4 w-4" />
            Configure report
          </Button>
        }
      />

      <FilterBar className="lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <DatePickerField label="From" defaultValue="2026-04-01" />
        <DatePickerField label="To" defaultValue="2026-05-06" />
        <LookupSelectField label="Report period" group="report-periods" fallbackOptions={[{ label: "This month", value: "This month" }, { label: "Last month", value: "Last month" }, { label: "Financial year", value: "Financial year" }]} />
        <LookupSelectField label="Format" group="export-formats" fallbackOptions={[{ label: "PDF", value: "PDF" }, { label: "Excel", value: "Excel" }, { label: "CSV", value: "CSV" }]} />
        <Button variant="secondary" className="self-end" onClick={() => toast({ tone: "info", title: "Report scheduled", description: `${activeReport} will be emailed every Monday in demo mode.` })}>
          <CalendarClock className="h-4 w-4" />
          Schedule
        </Button>
      </FilterBar>

      <Card className="overflow-hidden p-5">
        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="flex min-h-[340px] flex-col justify-between rounded-2xl bg-background p-5">
            <div>
              <Badge tone="green">Report library</Badge>
              <h2 className="mt-5 text-3xl font-black tracking-tight">Choose the report your team needs.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Use these reports for daily review, GST preparation, receivable follow-up, purchase control, and stock decisions.
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Sales", summary.sales],
                ["Expenses", summary.expenseTotal],
                ["Receivables", summary.receivables],
                ["Stock value", summary.stockValue],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl border bg-card p-4">
                  <p className="text-xs uppercase text-muted-foreground">{label}</p>
                  <p className="mt-2 text-xl font-black">{currency(value as number)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {reportGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{group.title}</p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.reports.map((report) => {
                    const ReportIcon = report.icon;
                    const active = activeReport === report.title;
                    return (
                      <button
                        key={report.title}
                        className={cn(
                          "min-h-24 rounded-2xl border p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg",
                          reportToneClass(report.tone, active),
                        )}
                        onClick={() => setActiveReport(report.title)}
                      >
                        <span className="flex items-center gap-3">
                          <ReportIcon className="h-5 w-5" />
                          <span className="font-black">{report.title}</span>
                        </span>
                        <span className="mt-3 block text-xs leading-5 text-white/70">{report.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black">{activeReport}</h2>
                  <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                </div>
              </div>
            </div>
            <Badge tone="blue">Live sample data</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-4 shadow-none">
              <p className="text-sm text-muted-foreground">Sales</p>
              <p className="mt-2 text-2xl font-black">{currency(summary.sales)}</p>
            </Card>
            <Card className="p-4 shadow-none">
              <p className="text-sm text-muted-foreground">Purchases</p>
              <p className="mt-2 text-2xl font-black">{currency(summary.purchaseTotal)}</p>
            </Card>
            <Card className="p-4 shadow-none">
              <p className="text-sm text-muted-foreground">Net movement</p>
              <p className="mt-2 text-2xl font-black">{currency(summary.sales - summary.expenseTotal)}</p>
            </Card>
          </div>

          <div className="mt-6">
            <DataTable
              headers={["Metric", "Current value", "Source", "Action"]}
              rows={[
                ["Receivables", currency(summary.receivables), `${customers.length} contacts`, <Button key="a" variant="ghost" onClick={() => setIsConfigOpen(true)}>Configure follow-up</Button>],
                ["Payables", currency(summary.payables), `${purchases.length} purchase bills`, <Button key="b" variant="ghost" onClick={() => setIsConfigOpen(true)}>Plan payments</Button>],
                ["Stock value", currency(summary.stockValue), `${inventory.length} SKUs`, <Button key="c" variant="ghost" onClick={() => setIsConfigOpen(true)}>Review stock</Button>],
                ["Expense booked", currency(summary.expenseTotal), `${expenses.length} expense entries`, <Button key="d" variant="ghost" onClick={() => setIsConfigOpen(true)}>Audit GST</Button>],
              ]}
            />
          </div>
        </Card>
        <AiActionCard />
      </div>
      <FormModal open={isConfigOpen} onOpenChange={setIsConfigOpen} title={`${activeReport} configuration`}>
        <ReportConfigForm reportName={activeReport} onClose={() => setIsConfigOpen(false)} />
      </FormModal>
    </div>
  );
}
