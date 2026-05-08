"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { CheckboxCard, FormCard, FormGrid, TextField } from "@/components/form-kit";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { BrandMark } from "@/components/brand-logo";
import { loginAuthUser } from "@/lib/api";
import { toast } from "@/components/toast";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthUser } from "@/store/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <Link href="/signup" className="hidden h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex">
            Create account
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <section className="container-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div className="order-2 animate-fade-up lg:order-1">
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

        <FormCard
          title={t("loginTitle")}
          description={t("loginSubtitle")}
          asForm
          showSuccessToast={false}
          className="order-1 mx-auto w-full max-w-md lg:order-2"
          onValidSubmit={async (values) => {
            setIsSubmitting(true);
            try {
              const response = await loginAuthUser({
                email: values.email,
                password: values.password,
              });
              dispatch(setAuthUser(response.user));
              toast({
                tone: "success",
                title: "Signed in",
                description: "Welcome back to KoshPilot.",
              });
              router.replace("/app");
            } catch (error) {
              toast({
                tone: "error",
                title: "Login failed",
                description: error instanceof Error ? error.message : "Please try again.",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <FormGrid columns={1}>
            <TextField label={t("loginEmail")} name="email" required type="email" placeholder="you@company.com" autoComplete="email" />
            <TextField label={t("loginPassword")} name="password" required type="password" minLength={8} placeholder="Enter your password" autoComplete="current-password" />
            <div className="flex items-center justify-between gap-4">
              <CheckboxCard label={t("rememberMe")} defaultChecked />
              <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              <LockKeyhole className="h-4 w-4" />
              {t("loginButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New to KoshPilot?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create your account
              </Link>
            </p>
          </FormGrid>
        </FormCard>
      </section>
    </main>
  );
}
