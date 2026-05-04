import { ActivityCard, AiActionCard, InvoiceRows, KpiGrid } from "@/components/workflow";
import { Card, SectionTitle } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Business dashboard" subtitle="AI-assisted overview for billing, receivables, inventory, and reports." />
      <KpiGrid />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-xl font-bold">Recent invoices</h2>
            <InvoiceRows />
          </Card>
          <ActivityCard />
        </div>
        <div className="space-y-6">
          <AiActionCard />
          <Card className="p-5">
            <h3 className="font-bold">Inventory alerts</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="rounded-2xl bg-amber-100 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Cotton roll A-12 below reorder level</p>
              <p className="rounded-2xl bg-blue-100 p-3 text-blue-800 dark:bg-blue-950 dark:text-blue-300">USB cable pack has slow movement</p>
              <p className="rounded-2xl bg-violet-100 p-3 text-violet-800 dark:bg-violet-950 dark:text-violet-300">Printer ink batch needs purchase order</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
