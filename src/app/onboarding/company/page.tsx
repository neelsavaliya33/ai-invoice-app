"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, Button, Card } from "@/components/ui";
import { FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { toast } from "@/components/toast";
import { aiPlans, industries } from "@/lib/data";
import { useAppDispatch } from "@/store/hooks";
import { setActiveIndustry, setAiPlan } from "@/store/store";
import { useI18n } from "@/lib/i18n";

const industryOptions = industries.map(([name]) => name);
const planOptions = aiPlans.map((plan) => ({
  label: `${plan.name} - ${plan.aiCreditLimit} AI credits`,
  value: plan.id,
}));

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useI18n();

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
              [Sparkles, "AI credits follow selected plan"],
              [CheckCircle2, "Skip payment and continue free"],
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
          description="Complete this after first login. You can stay on the free plan and upgrade later."
          asForm
          className="mx-auto w-full max-w-4xl"
          successMessage="Company profile saved"
          onValidSubmit={(values) => {
            const selectedPlan = aiPlans.find((plan) => plan.id === values.plan) ?? aiPlans[0];
            dispatch(setAiPlan({ plan: selectedPlan.id, limit: selectedPlan.aiCreditLimit, used: 0 }));
            dispatch(setActiveIndustry(values.industry));
            toast({
              tone: "success",
              title: "Company setup complete",
              description: `${values["company-name"]} is using the ${selectedPlan.name} plan with ${selectedPlan.aiCreditLimit} AI credits.`,
            });
            window.setTimeout(() => router.push("/app"), 650);
          }}
        >
          <div className="space-y-6">
            <FormGrid>
              <TextField label="Company name" name="company-name" required minLength={3} defaultValue="Kavya Textiles" />
              <TextField label="Legal name" name="legal-name" required minLength={3} defaultValue="Kavya Textiles Private Limited" />
              <SelectField label="Industry" name="industry" required options={[...industryOptions]} defaultValue="Textile" />
              <SelectField label="Business type" name="business-type" required options={["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited"]} defaultValue="Private Limited" />
              <TextField label="GSTIN" name="gstin" required pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]" defaultValue="24ABCDE1234F1Z5" />
              <TextField label="City" name="city" required minLength={2} defaultValue="Ahmedabad" />
              <TextField label="State" name="state" required minLength={2} defaultValue="Gujarat" />
              <SelectField label="Plan" name="plan" required options={planOptions} defaultValue="free" />
            </FormGrid>

            <div className="rounded-2xl border bg-background p-4">
              <p className="font-bold">Plan and AI credit rule</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {aiPlans.map((plan) => (
                  <div key={plan.id} className="rounded-xl border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold">{plan.name}</span>
                      <Badge tone={plan.id === "free" ? "green" : "blue"}>{plan.aiCreditLimit} credits</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{plan.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <Button type="submit">
                Save company and continue
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/app" className="text-sm font-semibold text-primary hover:underline">
                Skip for now and open demo dashboard
              </Link>
            </div>
          </div>
        </FormCard>
      </section>
    </main>
  );
}
