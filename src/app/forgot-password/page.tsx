"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { Button, Card, Input } from "@/components/ui";
import { FormCard, FormGrid, TextField } from "@/components/form-kit";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/components/toast";
import { confirmPasswordReset, requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const enteredOtp = otp.join("");

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

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
        {step === "email" ? (
          <FormCard
            title={t("forgotPassword")}
            description="Enter your account email and KoshPilot will send a password reset OTP."
            asForm
            className="w-full max-w-md"
            showSuccessToast={false}
            onValidSubmit={async (values) => {
              setIsSubmitting(true);
              try {
                const response = await requestPasswordReset(values.email);
                setEmail(response.email);
                setDevOtp(response.devOtp ?? "");
                setOtp(Array(6).fill(""));
                setStep("reset");
                toast({
                  tone: "success",
                  title: "Recovery OTP sent",
                  description: response.devOtp
                    ? `SMTP request created. Local debug OTP: ${response.devOtp}.`
                    : `Check ${values.email} for the reset code.`,
                });
              } catch (error) {
                toast({
                  tone: "error",
                  title: "Could not send reset OTP",
                  description: error instanceof Error ? error.message : "Please try again.",
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <FormGrid columns={1}>
              <TextField label={t("loginEmail")} name="email" required type="email" placeholder={email || "you@company.com"} autoComplete="email" />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <MailCheck className="h-4 w-4" />
                Send recovery OTP
              </Button>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </FormGrid>
          </FormCard>
        ) : (
          <Card className="w-full max-w-md p-5">
            <h2 className="text-xl font-bold">Reset password</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the code sent to <span className="font-semibold text-foreground">{email}</span>{devOtp ? <>. Local debug OTP: <span className="font-semibold text-foreground">{devOtp}</span></> : "."}
            </p>
            <div className="mt-5 grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(node) => {
                    otpRefs.current[index] = node;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  aria-label={`OTP digit ${index + 1}`}
                  className="h-14 bg-background text-center text-xl font-black text-foreground caret-primary"
                  onChange={(event) => updateOtp(index, event.target.value)}
                />
              ))}
            </div>
            <FormCard
              title=""
              asForm
              showSuccessToast={false}
              className="mt-5 border-0 bg-transparent p-0 shadow-none"
              onValidSubmit={async (values) => {
                if (values.password !== values["confirm-password"]) {
                  toast({
                    tone: "error",
                    title: "Password mismatch",
                    description: "Password and confirm password must match.",
                  });
                  return;
                }
                setIsSubmitting(true);
                try {
                  await confirmPasswordReset({
                    email,
                    otp: enteredOtp,
                    newPassword: values.password,
                  });
                  toast({
                    tone: "success",
                    title: "Password reset",
                    description: "You can sign in with your new password now.",
                  });
                  router.push("/login");
                } catch (error) {
                  toast({
                    tone: "error",
                    title: "Could not reset password",
                    description: error instanceof Error ? error.message : "Please try again.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <FormGrid columns={1}>
                <TextField label="New password" name="password" required type="password" minLength={8} placeholder="Create a new password" autoComplete="new-password" />
                <TextField label="Confirm password" name="confirm-password" required type="password" minLength={8} placeholder="Re-enter new password" autoComplete="new-password" />
                <Button type="submit" className="w-full" disabled={enteredOtp.length !== 6 || isSubmitting}>
                  Reset password
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => setStep("email")}>
                  Change email
                </Button>
              </FormGrid>
            </FormCard>
          </Card>
        )}
      </section>
    </main>
  );
}
