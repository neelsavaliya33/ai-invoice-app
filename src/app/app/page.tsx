"use client";

import { useState } from "react";
import { ActivityCard, AiActionCard, InvoiceRows, KpiGrid } from "@/components/workflow";
import { Button, Card, SectionTitle } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
import { CompanyWorkspaceCard } from "@/components/company-switcher";
import { FormModal } from "@/components/form-kit";
import { CustomerLedgerActionForm, InvoiceDocumentForm, PaymentActionForm, StockActionForm } from "@/components/workflow-actions";
import { toast } from "@/components/toast";
import { Plus, ReceiptIndianRupee, Users, Boxes, Banknote, type LucideIcon } from "lucide-react";

const quickActions: Array<[NonNullable<DashboardModal>, string, string, LucideIcon]> = [
  ["invoice", "Quick invoice", "Create a GST billing document", ReceiptIndianRupee],
  ["customer", "Add customer", "Ledger, credit limit, reminders", Users],
  ["item", "Add item", "SKU, serial, reorder workflow", Boxes],
  ["payment", "Record payment", "Receipt, advance, matching", Banknote],
];

type DashboardModal = "invoice" | "customer" | "item" | "payment" | null;

export default function DashboardPage() {
  const { t } = useI18n();
  const [activeModal, setActiveModal] = useState<DashboardModal>(null);
  return (
    <div className="space-y-6">
      <SectionTitle title={t("businessDashboard")} subtitle={t("dashboardSubtitle")} />
      <CompanyWorkspaceCard />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map(([key, title, subtitle, Icon]) => (
          <Button
            key={key as string}
            variant="secondary"
            className="h-auto justify-start rounded-2xl p-4 text-left"
            onClick={() => setActiveModal(key)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-bold">{title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{subtitle}</span>
            </span>
            <Plus className="ml-auto h-4 w-4 shrink-0" />
          </Button>
        ))}
      </div>
      <KpiGrid />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-xl font-bold">{t("recentInvoices")}</h2>
            <InvoiceRows />
          </Card>
          <ActivityCard />
        </div>
        <div className="space-y-6">
          <AiActionCard />
          <Card className="p-5">
            <h3 className="font-bold">{t("inventoryAlerts")}</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Cotton roll A-12 below reorder level", "Open stock action"],
                ["USB cable pack has slow movement", "Review stock report"],
                ["Printer ink batch needs purchase order", "Create reorder"],
              ].map(([message, action]) => (
                <button
                  key={message}
                  className="w-full rounded-2xl bg-muted p-3 text-left transition hover:bg-primary/10"
                  onClick={() => toast({ tone: "success", title: action, description: `${message} was added to today's follow-up queue.` })}
                >
                  <span className="block font-semibold">{message}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{action}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <FormModal open={activeModal === "invoice"} onOpenChange={(open) => setActiveModal(open ? "invoice" : null)} title="Quick invoice">
        <InvoiceDocumentForm onClose={() => setActiveModal(null)} />
      </FormModal>
      <FormModal open={activeModal === "customer"} onOpenChange={(open) => setActiveModal(open ? "customer" : null)} title="Add customer">
        <CustomerLedgerActionForm onClose={() => setActiveModal(null)} />
      </FormModal>
      <FormModal open={activeModal === "item"} onOpenChange={(open) => setActiveModal(open ? "item" : null)} title="Add item">
        <StockActionForm onClose={() => setActiveModal(null)} />
      </FormModal>
      <FormModal open={activeModal === "payment"} onOpenChange={(open) => setActiveModal(open ? "payment" : null)} title="Record payment">
        <PaymentActionForm onClose={() => setActiveModal(null)} />
      </FormModal>
    </div>
  );
}
