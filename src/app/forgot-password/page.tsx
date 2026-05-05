"use client";

import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { Button } from "@/components/ui";
import { FormCard, FormGrid, TextField } from "@/components/form-kit";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/components/toast";

export default function ForgotPasswordPage() {
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

      <section className="container-shell grid min-h-[calc(100vh-5rem)] place-items-center py-10">
        <FormCard
          title={t("forgotPassword")}
          description="Enter your account email and KoshPilot will send demo recovery instructions."
          asForm
          className="w-full max-w-md"
          successMessage="Recovery email prepared"
          onValidSubmit={(values) => {
            toast({
              tone: "success",
              title: "Recovery instructions sent",
              description: `Demo reset steps were prepared for ${values.email}.`,
            });
          }}
        >
          <FormGrid columns={1}>
            <TextField label={t("loginEmail")} name="email" required type="email" defaultValue="owner@koshpilot.app" />
            <Button type="submit" className="w-full">
              <MailCheck className="h-4 w-4" />
              Send recovery link
            </Button>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </FormGrid>
        </FormCard>
      </section>
    </main>
  );
}
