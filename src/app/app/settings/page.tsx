"use client";

import { setTheme } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Card, SectionTitle } from "@/components/ui";
import { CheckboxCard, FormCard, FormGrid, SelectField, TextareaField, TextField } from "@/components/form-kit";
import { Monitor, Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  CreditInsightCard,
  CreditSettingsPanel,
  CreditSummaryCards,
  CommonCreditWalletCard,
  CreditUsageTable,
  PlanAddOnCards,
} from "@/components/credit-system";
import { CompanyWorkspaceCard, useActiveCompany } from "@/components/company-switcher";

export default function SettingsPage() {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const activeCompany = useActiveCompany();
  return (
    <div className="space-y-6">
      <SectionTitle title={t("settings")} subtitle={t("settingsSubtitle")} />
      <CompanyWorkspaceCard />
      <CreditSummaryCards />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <FormCard key={activeCompany.id} title="Company profile" description="Reusable settings form for company identity and invoice defaults." asForm>
          <FormGrid>
            <TextField label="Company name" required minLength={3} defaultValue={activeCompany.name} />
            <TextField label="Legal name" required minLength={3} defaultValue={activeCompany.legalName} />
            <TextField label="GSTIN" required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue={activeCompany.gstin} />
            <TextField label="PAN" required pattern="[A-Z]{5}[0-9]{4}[A-Z]" defaultValue={activeCompany.gstin.slice(2, 12)} />
            <TextField label="Phone" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" defaultValue="+91 98765 43210" />
            <TextField label="Email" required type="email" defaultValue="hello@koshpilot.app" />
            <TextField label="Invoice prefix" required pattern="[A-Z]{2,6}" defaultValue="INV" />
            <TextField label="Next invoice number" required type="number" min={1} defaultValue="1053" />
            <TextareaField label="Default notes" required minLength={8} defaultValue="Thank you for your business." />
            <TextareaField label="Terms and conditions" required minLength={10} defaultValue="Payment due within agreed terms." />
          </FormGrid>
          <Button type="submit" className="mt-5">Save company</Button>
        </FormCard>
        <div className="space-y-6">
          <CreditSettingsPanel />
          <CreditInsightCard />
          <PlanAddOnCards />
          <Card className="p-5">
            <h2 className="text-xl font-bold">Theme preference</h2>
            <p className="mt-2 text-sm text-muted-foreground">System follows your device appearance settings.</p>
            <div className="mt-5 grid gap-3">
              {[
                ["system", "System", Monitor],
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
              ].map(([key, label, Icon]) => (
                <button
                  key={key as string}
                  onClick={() => dispatch(setTheme(key as never))}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${theme === key ? "border-primary bg-primary/10 text-primary" : "bg-background"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{label as string}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-xl font-bold">Security</h2>
            <div className="mt-5 grid gap-4">
              <SelectField label="Session timeout" options={["30 minutes", "1 hour"]} />
              <CheckboxCard label="Require approval for exports" description="Adds review friction before sensitive data leaves the app." />
              <CheckboxCard label="Enable audit logs" description="Track invoice, user, stock, and export changes." />
            </div>
          </Card>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <CommonCreditWalletCard />
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">{t("recentAiRequests")}</h2>
          <CreditUsageTable />
        </Card>
      </div>
    </div>
  );
}
