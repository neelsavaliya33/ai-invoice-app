"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Building2, CheckCircle2, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, Button, Card } from "@/components/ui";
import { FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { toast } from "@/components/toast";
import { industries } from "@/lib/data";
import { useAppDispatch } from "@/store/hooks";
import { setActiveCompany, setActiveIndustry, setAiPlan } from "@/store/store";
import { useI18n } from "@/lib/i18n";
import { useTrialConfig } from "@/lib/use-plans";
import { createUserCompany } from "@/lib/api";

const industryOptions = industries.map(([name]) => name);

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { trialConfig } = useTrialConfig();
  const trialDaysLabel = trialConfig ? `${trialConfig.trialDays}-day` : "configured";

  return (
    <main className="min-h-screen bg-background">
      <header className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <BrandMark />
          <div>
            <p className="text-xl font-bold">KoshPilot</p>
            <p className="text-xs text-muted-foreground">{t("invoiceOs")}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <section className="container-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 xl:grid-cols-[0.85fr_1.15fr] xl:items-center">
        <div className="animate-fade-up">
          <Badge tone="green">First company setup</Badge>
          <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Add your company details after account registration.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            This step prepares invoices, GST fields, inventory categories, reports, e-way bill defaults, payroll, and AI recommendations for your business type.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [Building2, "Company and GST profile"],
              [Sparkles, trialConfig ? `${trialConfig.aiCreditLimit} trial AI credits` : "Trial AI credits from backend"],
              [CheckCircle2, `${trialDaysLabel} free trial starts by default`],
              [ArrowRight, "Open dashboard after setup"],
            ].map(([Icon, label]) => (
              <Card key={label as string} className="p-5">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm font-semibold">{label as string}</p>
              </Card>
            ))}
          </div>
        </div>

        <FormCard
          title="Company details"
          description={`Complete this after first login. Your ${trialDaysLabel} free trial is managed from global configuration.`}
          asForm
          className="mx-auto w-full max-w-4xl"
          successMessage="Company profile saved"
          showSuccessToast={false}
          onValidSubmit={async (values) => {
            try {
              const company = await createUserCompany({
                name: values["company-name"],
                legal_name: values["legal-name"],
                industry: values.industry,
                gstin: values.gstin,
                city: values.city,
                state: values.state,
                currency: "INR",
                financial_year: "FY 2026-27",
              });
              if (trialConfig) {
                dispatch(setAiPlan({ plan: "free-trial", limit: trialConfig.aiCreditLimit, used: 0 }));
              }
              dispatch(setActiveIndustry(values.industry));
              dispatch(setActiveCompany(company.id));
              queryClient.setQueryData(["user-companies"], (current: unknown) => {
                const currentCompanies = Array.isArray(current) ? current : [];
                return [
                  company,
                  ...currentCompanies.filter((item): item is typeof company => {
                    return Boolean(
                      item &&
                        typeof item === "object" &&
                        "id" in item &&
                        (item as { id: string }).id !== company.id,
                    );
                  }),
                ];
              });
              queryClient.invalidateQueries({ queryKey: ["user-companies"] });
              toast({
                tone: "success",
                title: "Company setup complete",
                description: `${company.name} is now available in your company dropdown.`,
              });
              window.setTimeout(() => router.push("/app"), 650);
            } catch (error) {
              toast({
                tone: "error",
                title: "Company setup failed",
                description: error instanceof Error ? error.message : "Please try again.",
              });
            }
          }}
        >
          <div className="space-y-6">
            <FormGrid>
              <TextField label="Company name" name="company-name" required minLength={3} placeholder="Kavya Textiles" />
              <TextField label="Legal name" name="legal-name" required minLength={3} placeholder="Kavya Textiles Private Limited" />
              <SelectField label="Industry" name="industry" required options={[...industryOptions]} placeholder="Select industry" />
              <SelectField label="Business type" name="business-type" required options={["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited"]} placeholder="Select business type" />
              <TextField
                label="GSTIN"
                name="gstin"
                pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]"
                placeholder="Optional GSTIN"
                helper="Leave blank if your business is not registered for GST yet."
              />
              <TextField label="City" name="city" required minLength={2} placeholder="Ahmedabad" />
              <TextField label="State" name="state" required minLength={2} placeholder="Gujarat" />
            </FormGrid>

            <div className="rounded-2xl border bg-background p-4">
              <p className="font-bold">Free trial starts automatically</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Company setup starts your {trialDaysLabel} workspace by default. No plan selection or payment is needed during first setup.
              </p>
              <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                <span className="rounded-xl border bg-card p-3 font-semibold">
                  {trialConfig?.companyLimit ?? "Configured"} companies
                </span>
                <span className="rounded-xl border bg-card p-3 font-semibold">
                  {trialConfig?.userLimit ?? "Configured"} users
                </span>
                <span className="rounded-xl border bg-card p-3 font-semibold">
                  {trialConfig?.aiCreditLimit ?? "Configured"} AI credits
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Save company and continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </FormCard>
      </section>
    </main>
  );
}
