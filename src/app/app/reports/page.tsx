import { AiActionCard, ReportCards } from "@/components/workflow";
import { Button, Card, SectionTitle } from "@/components/ui";
import { FilterBar, SelectField, TextField } from "@/components/form-kit";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Reports" subtitle="Profit, receivables, inventory, GST, and AI business explanations." action={<Button>Export PDF</Button>} />
      <FilterBar className="lg:grid-cols-5">
        <TextField label="From" type="date" />
        <TextField label="To" type="date" />
        <SelectField label="Customer" options={["All customers", "Kavya Textiles"]} />
        <SelectField label="Category" options={["All categories", "Textile"]} />
        <Button variant="secondary" className="self-end">Schedule report</Button>
      </FilterBar>
      <div className="flex flex-wrap gap-2">
        {["Profit & Loss", "Sales", "Purchases", "Receivables", "Payables", "Inventory", "GST Summary"].map((tab) => (
          <Button key={tab} variant="secondary" className="h-9">{tab}</Button>
        ))}
      </div>
      <ReportCards />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="text-xl font-bold">Sales vs expenses</h2>
          <div className="mt-8 flex h-72 items-end gap-5 rounded-2xl bg-muted p-6">
            {[180, 220, 160, 260, 240, 300].map((height, index) => (
              <div key={index} className="flex flex-1 items-end gap-2">
                <div className="w-full rounded-t-2xl bg-primary" style={{ height }} />
                <div className="w-full rounded-t-2xl bg-secondary" style={{ height: height * 0.58 }} />
              </div>
            ))}
          </div>
        </Card>
        <AiActionCard />
      </div>
    </div>
  );
}
