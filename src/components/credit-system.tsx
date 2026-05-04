"use client";

import { Gauge, Sparkles, TrendingUp } from "lucide-react";
import { Badge, Button, Card, DataTable } from "@/components/ui";
import { FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { aiCreditSummary, aiUsageByModule, aiUsageLogs } from "@/lib/data";
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
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {remaining} {t("credits")} {t("remaining")} this month.
      </p>
    </div>
  );
}

export function CreditWalletButton() {
  const { remaining, percent } = useCreditWallet();
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
            <p className="text-xs text-muted-foreground">Shared by AI actions across all pages</p>
          </div>
          <Badge tone={percent >= 75 ? "amber" : "green"}>{percent}% used</Badge>
        </div>
        <div className="mt-4 rounded-2xl border bg-background p-4">
          <CreditProgress compact />
        </div>
        <div className="mt-4 space-y-3">
          {aiUsageByModule.slice(0, 4).map((item) => (
            <div key={item.module} className="flex items-center justify-between gap-3 text-sm">
              <span>{item.module}</span>
              <span className="font-semibold">{item.used} credits</span>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CreditSummaryCards() {
  const { t } = useI18n();
  const { used, limit, remaining, percent } = useCreditWallet();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[
        [t("monthlyLimit"), limit.toLocaleString("en-IN"), "blue"],
        [t("used"), used.toLocaleString("en-IN"), percent >= 75 ? "amber" : "green"],
        [t("remaining"), remaining.toLocaleString("en-IN"), remaining < 150 ? "red" : "violet"],
        [t("resetDate"), aiCreditSummary.resetDate, "default"],
      ].map(([label, value, tone]) => (
        <Card key={label} className="p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <Badge className="mt-4" tone={tone as never}>Common wallet</Badge>
        </Card>
      ))}
    </div>
  );
}

export function CreditUsageByPage() {
  const { t } = useI18n();
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{t("usageByPage")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">One shared wallet tracks credit use from every page.</p>
        </div>
        <Gauge className="h-6 w-6 text-primary" />
      </div>
      <div className="space-y-4">
        {aiUsageByModule.map((item) => {
          const percent = usagePercent(item.used, item.limit);
          return (
            <div key={item.module} className="rounded-2xl border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.module}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("topAction")}: {item.topAction}
                  </p>
                </div>
                <Badge tone={percent >= 80 ? "amber" : "blue"}>
                  {item.used}/{item.limit} {t("credits")}
                </Badge>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function CreditSettingsPanel() {
  const { t } = useI18n();
  const { limit } = useCreditWallet();
  return (
    <FormCard
      title="Common credit system"
      description="Set one shared credit wallet for AI prompts, validations, summaries, and automation across the app."
      asForm
    >
      <FormGrid>
        <TextField label={t("monthlyLimit")} required type="number" min={100} defaultValue={String(limit)} />
        <TextField label={t("warningLimit")} required type="number" min={50} defaultValue={String(aiCreditSummary.warningAt)} />
        <SelectField label="Plan" required defaultValue={aiCreditSummary.plan} options={["Starter AI", "Growth AI", "Business AI"]} />
        <SelectField label="Over-limit action" required defaultValue="Warn only" options={["Warn only", "Block new prompts", "Require owner approval"]} />
      </FormGrid>
      <Button type="submit" className="mt-5">{t("saveLimit")}</Button>
    </FormCard>
  );
}

export function CreditUsageTable() {
  const { t } = useI18n();
  return (
    <DataTable
      headers={["Request", "Page", "Action", t("credits"), "User", "Time", t("status")]}
      rows={aiUsageLogs.map((log) => [
        <span key="id" className="font-semibold">{log.id}</span>,
        log.page,
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
        Invoice drafting and report summaries are the highest credit users. Keep the warning limit at 900 credits so the owner sees a prompt before usage crosses 75%.
      </p>
      <Button variant="secondary" className="mt-5 w-full">
        <TrendingUp className="h-4 w-4" />
        Optimize credit usage
      </Button>
    </Card>
  );
}
