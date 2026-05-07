"use client";

import { Building2, Sparkles, TrendingUp, Truck, Users } from "lucide-react";
import { Badge, Button, Card, DataTable } from "@/components/ui";
import { FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { aiCreditSummary, aiPlans, aiUsageLogs, companies, ewayBills, planAddOns, users } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAppSelector } from "@/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

function usagePercent(used: number, limit: number) {
  return Math.min(100, Math.round((used / limit) * 100));
}

export function useCreditWallet() {
  const used = useAppSelector((state) => state.ui.aiCreditsUsed);
  const limit = useAppSelector((state) => state.ui.aiCreditLimit);
  const remaining = Math.max(0, limit - used);
  const percent = usagePercent(used, limit);
  return { used, limit, remaining, percent };
}

export function useCurrentPlan() {
  const planId = useAppSelector((state) => state.ui.aiPlan);
  return aiPlans.find((plan) => plan.id === planId) ?? aiPlans[0];
}

export function CreditProgress({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const { used, limit, remaining, percent } = useCreditWallet();
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">{compact ? "Credits" : t("aiCreditLimit")}</span>
        <span className="text-muted-foreground">
          {used}/{limit} {t("used")}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-destructive" : percent >= 80 ? "bg-secondary" : "bg-primary"}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {remaining} {t("credits")} {t("remaining")} this month. {percent >= 100 ? "Top up or upgrade to continue AI actions." : percent >= 80 ? "Usage is above 80%." : ""}
      </p>
    </div>
  );
}

export function CreditWalletButton() {
  const { used, limit, remaining, percent } = useCreditWallet();
  const plan = useCurrentPlan();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="hidden min-w-[150px] justify-start lg:inline-flex">
          <Sparkles className="h-4 w-4" />
          {remaining} credits
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Common credit wallet</p>
            <p className="text-xs text-muted-foreground">{plan.name} plan. Shared by AI actions across all pages</p>
          </div>
          <Badge tone={percent >= 100 ? "red" : percent >= 80 ? "amber" : "green"}>{percent}% used</Badge>
        </div>
        <div className="mt-4 rounded-2xl border bg-background p-4">
          <CreditProgress compact />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 font-black">{limit}</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Used</p>
            <p className="mt-1 font-black">{used}</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Left</p>
            <p className="mt-1 font-black">{remaining}</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CreditSummaryCards() {
  const { t } = useI18n();
  const { used, limit, remaining, percent } = useCreditWallet();
  const plan = useCurrentPlan();
  const activeOrInvitedUsers = users.filter((user) => user.status === "Active" || user.status === "Invited").length;
  const usageCards = [
    ["Users", `${activeOrInvitedUsers}/${plan.userLimit}`, "Active + invited seats", Users, activeOrInvitedUsers >= plan.userLimit ? "red" : "green"],
    ["AI credits", `${used}/${limit}`, `${remaining} remaining this month`, Sparkles, percent >= 100 ? "red" : percent >= 80 ? "amber" : "blue"],
    ["Companies", `${companies.length}/${plan.companyLimit}${plan.id === "business" ? "+" : ""}`, "Company workspaces", Building2, companies.length > plan.companyLimit ? "amber" : "violet"],
    ["E-way bills", `${ewayBills.length}/${plan.ewayBillLimit}`, "Generated this period", Truck, ewayBills.length >= plan.ewayBillLimit ? "red" : "green"],
  ] as const;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {usageCards.map(([label, value, helper, Icon, tone]) => (
        <Card key={label} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <Badge className="mt-4" tone={tone as never}>{helper}</Badge>
        </Card>
      ))}
    </div>
  );
}

export function CommonCreditWalletCard() {
  const { t } = useI18n();
  const { used, limit, remaining, percent } = useCreditWallet();
  const plan = useCurrentPlan();
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Common AI credit wallet</h2>
          <p className="mt-1 text-sm text-muted-foreground">{plan.name} includes {plan.aiCreditLimit.toLocaleString("en-IN")} monthly credits. Every AI action uses this single shared balance.</p>
        </div>
        <Badge tone={percent >= 100 ? "red" : percent >= 80 ? "amber" : "green"}>{percent}% used</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total credits", limit.toLocaleString("en-IN"), "blue"],
          ["Used credits", used.toLocaleString("en-IN"), percent >= 75 ? "amber" : "green"],
          ["Remaining", remaining.toLocaleString("en-IN"), remaining < 150 ? "red" : "violet"],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-2xl border bg-background p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
            <Badge className="mt-4" tone={tone as never}>{t("credits")}</Badge>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border bg-background p-4">
        <CreditProgress compact />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary">Top up AI credits</Button>
        <Button variant="secondary">Upgrade plan</Button>
      </div>
    </Card>
  );
}

export function CreditSettingsPanel() {
  const { t } = useI18n();
  const { limit } = useCreditWallet();
  const plan = useCurrentPlan();
  return (
    <FormCard
      title="Plan and limits"
      description="Pricing is annual, per company, and web-app only. AI uses one shared company wallet."
      asForm
    >
      <FormGrid>
        <TextField label="Total AI credits" required type="number" min={100} defaultValue={String(limit)} />
        <TextField label={t("warningLimit")} required type="number" min={50} defaultValue={String(aiCreditSummary.warningAt)} />
        <SelectField label="Plan" required defaultValue={plan.name} options={aiPlans.map((item) => item.name)} />
        <SelectField label="Over-limit action" required defaultValue="Block new prompts" options={["Block new prompts", "Require owner approval"]} />
      </FormGrid>
      <Button type="submit" className="mt-5">{t("saveLimit")}</Button>
    </FormCard>
  );
}

export function PlanAddOnCards() {
  return (
    <Card className="p-5">
      <h2 className="text-xl font-bold">Add-ons</h2>
      <p className="mt-1 text-sm text-muted-foreground">Use add-ons instead of forcing a full upgrade when the business only needs one extra limit.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {planAddOns.map((addOn) => (
          <div key={addOn.id} className="rounded-2xl border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold">{addOn.name}</p>
              <Badge tone="green">{addOn.price}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{addOn.description}</p>
            <Button variant="secondary" className="mt-4 h-9">Add</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function CreditUsageTable() {
  const { t } = useI18n();
  return (
    <DataTable
      headers={["Request", "Action", t("credits"), "User", "Time", t("status")]}
      rows={aiUsageLogs.map((log) => [
        <span key="id" className="font-semibold">{log.id}</span>,
        log.action,
        log.credits,
        log.user,
        log.time,
        <Badge key="status" tone={log.status === "Completed" ? "green" : "blue"}>{log.status}</Badge>,
      ])}
    />
  );
}

export function CreditInsightCard() {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-accent/15 p-2 text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">Credit usage insight</h3>
          <p className="text-xs text-muted-foreground">{t("remaining")} credits are healthy</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        AI credits are tracked as one common balance. Every invoice draft, report summary, stock risk check, and reminder uses the same wallet.
      </p>
      <Button variant="secondary" className="mt-5 w-full">
        <TrendingUp className="h-4 w-4" />
        Optimize credit usage
      </Button>
    </Card>
  );
}
