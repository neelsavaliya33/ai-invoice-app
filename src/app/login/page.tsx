"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { CheckboxCard, FormCard, FormGrid, TextField } from "@/components/form-kit";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "@/components/brand-logo";

export default function LoginPage() {
  const router = useRouter();
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

      <section className="container-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div className="animate-fade-up">
          <Badge tone="green">{t("protectedBy")}</Badge>
          <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight">{t("loginTrustTitle")}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{t("loginTrustBody")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "Role-based access"],
              [Bot, "AI actions"],
              [CheckCircle2, "GST-ready records"],
            ].map(([Icon, label]) => (
              <Card key={label as string} className="p-5">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm font-semibold">{label as string}</p>
              </Card>
            ))}
          </div>
        </div>

        <FormCard title={t("loginTitle")} description={t("loginSubtitle")} asForm className="mx-auto w-full max-w-md">
          <FormGrid columns={1}>
            <TextField label={t("loginEmail")} name="email" required type="email" defaultValue="owner@koshpilot.app" />
            <TextField label={t("loginPassword")} name="password" required type="password" minLength={8} defaultValue="demo@1234" />
            <div className="flex items-center justify-between gap-4">
              <CheckboxCard label={t("rememberMe")} defaultChecked />
              <Link href="#" className="text-sm font-semibold text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={(event) => {
                const form = event.currentTarget.closest("form");
                window.setTimeout(() => {
                  if (form?.dataset.submitted === "true") router.push("/app");
                });
              }}
            >
              <LockKeyhole className="h-4 w-4" />
              {t("loginButton")}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/app")}
            >
              {t("demoLogin")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </FormGrid>
        </FormCard>
      </section>
    </main>
  );
}
