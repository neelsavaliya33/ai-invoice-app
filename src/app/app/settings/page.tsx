"use client";

import { setAuthUser, setTheme } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Card, SectionTitle } from "@/components/ui";
import { CheckboxCard, FormCard, FormGrid, FormModal, FormSubmitRow, SelectField, TextareaField, TextField } from "@/components/form-kit";
import { LockKeyhole, Monitor, Moon, Save, Sun } from "lucide-react";
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
import { SettingsProfileForm } from "@/components/workflow-actions";
import { useState } from "react";
import { changeAuthPassword, updateAuthProfile } from "@/lib/api";
import { toast } from "@/components/toast";

export default function SettingsPage() {
  const theme = useAppSelector((state) => state.ui.theme);
  const authUser = useAppSelector((state) => state.ui.authUser);
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const activeCompany = useActiveCompany();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SectionTitle title={t("settings")} subtitle={t("settingsSubtitle")} action={<Button onClick={() => setIsSettingsOpen(true)}>Edit settings</Button>} />
      <CompanyWorkspaceCard />
      <div className="grid gap-6 xl:grid-cols-2">
        <FormCard
          key={`profile-${authUser?.id ?? "guest"}`}
          title="User profile"
          description="Update the signed-in user details used across KoshPilot."
          asForm
          showSuccessToast={false}
          onValidSubmit={async (values) => {
            try {
              const user = await updateAuthProfile({
                name: values.name,
                email: values.email,
              });
              dispatch(setAuthUser(user));
              toast({
                tone: "success",
                title: "Profile updated",
                description: "Your profile information is now synced with the backend.",
              });
            } catch (error) {
              toast({
                tone: "error",
                title: "Profile update failed",
                description: error instanceof Error ? error.message : "Please try again.",
              });
            }
          }}
        >
          <FormGrid columns={2}>
            <TextField label="Full name" name="name" required minLength={3} defaultValue={authUser?.name ?? ""} placeholder="Your full name" autoComplete="name" />
            <TextField label="Email address" name="email" required type="email" defaultValue={authUser?.email ?? ""} placeholder="you@company.com" autoComplete="email" />
          </FormGrid>
          <FormSubmitRow>
            <Button type="submit">
              <Save className="h-4 w-4" />
              Save profile
            </Button>
          </FormSubmitRow>
        </FormCard>
        <FormCard
          title="Change password"
          description="Confirm your current password before setting a new one."
          asForm
          showSuccessToast={false}
          onValidSubmit={async (values) => {
            if (values.newPassword !== values.confirmPassword) {
              toast({
                tone: "error",
                title: "Password mismatch",
                description: "New password and confirm password must match.",
              });
              return;
            }
            try {
              const response = await changeAuthPassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
              });
              dispatch(setAuthUser(response.user));
              toast({
                tone: "success",
                title: "Password changed",
                description: "Use your new password the next time you sign in.",
              });
            } catch (error) {
              toast({
                tone: "error",
                title: "Password change failed",
                description: error instanceof Error ? error.message : "Please try again.",
              });
            }
          }}
        >
          <FormGrid columns={1}>
            <TextField label="Current password" name="currentPassword" required type="password" minLength={8} placeholder="Enter current password" autoComplete="current-password" />
            <TextField label="New password" name="newPassword" required type="password" minLength={8} placeholder="Create new password" autoComplete="new-password" />
            <TextField label="Confirm password" name="confirmPassword" required type="password" minLength={8} placeholder="Re-enter new password" autoComplete="new-password" />
          </FormGrid>
          <FormSubmitRow>
            <Button type="submit">
              <LockKeyhole className="h-4 w-4" />
              Change password
            </Button>
          </FormSubmitRow>
        </FormCard>
      </div>
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
          <FormSubmitRow>
            <Button type="submit">Save company</Button>
          </FormSubmitRow>
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
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Automatic e-invoice / e-way bill</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">Disabled</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Generate draft e-invoice and e-way bill details when creating sales, credit notes, and debit notes.</p>
          <Button className="mt-5" variant="secondary">Enable now</Button>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Lock transactions</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">Disabled</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Freeze transactions up to a date so editors cannot change closed accounting periods.</p>
          <Button className="mt-5" variant="secondary">Enable now</Button>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-bold">Other features</h2>
          <div className="mt-5 grid gap-3">
            {["Quotation", "Sale order", "Purchase order", "Delivery challan"].map((feature) => (
              <label key={feature} className="flex items-center justify-between rounded-2xl border bg-background p-3 text-sm font-semibold">
                {feature}
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              </label>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <CommonCreditWalletCard />
        <Card className="p-5">
          <h2 className="mb-4 text-xl font-bold">{t("recentAiRequests")}</h2>
          <CreditUsageTable />
        </Card>
      </div>
      <FormModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} title="Workspace settings">
        <SettingsProfileForm onClose={() => setIsSettingsOpen(false)} />
      </FormModal>
    </div>
  );
}
