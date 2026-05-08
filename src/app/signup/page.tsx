"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, BadgeIndianRupee, CheckCircle2, Check, FileCheck2, LockKeyhole, Sparkles, WalletCards } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, Button, Card, Input } from "@/components/ui";
import { FormCard, FormGrid, TextField } from "@/components/form-kit";
import { toast } from "@/components/toast";
import { useI18n } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";
import { setAiPlan, setAuthUser } from "@/store/store";
import { cn } from "@/lib/utils";
import { registerAuthUser, requestAuthOtp, verifyAuthOtp } from "@/lib/api";
import { useTrialConfig } from "@/lib/use-plans";

type SignupStep = "email" | "otp" | "details";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { trialConfig } = useTrialConfig();
  const trialDaysLabel = trialConfig?.trialDays ? `${trialConfig.trialDays}-day` : "configured";
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [devOtp, setDevOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const enteredOtp = otp.join("");

  async function sendOtp(nextEmail: string) {
    setIsSubmitting(true);
    try {
      const response = await requestAuthOtp(nextEmail, "verify_email");
      setEmail(response.email);
      setDevOtp(response.devOtp ?? "");
      setOtp(Array(6).fill(""));
      setStep("otp");
      toast({
        tone: "success",
        title: "Verification code sent",
        description: response.devOtp
          ? `SMTP request created. Local debug OTP: ${response.devOtp}.`
          : `Check ${nextEmail} for the verification code.`,
      });
    } catch (error) {
      toast({
        tone: "error",
        title: "Could not send OTP",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp() {
    setIsSubmitting(true);
    try {
      const response = await verifyAuthOtp(email, enteredOtp, "verify_email");
      if (response.user && response.auth) {
        dispatch(setAuthUser(response.user));
        toast({
          tone: "success",
          title: "Email verified",
          description: "This account already exists, so you are signed in now.",
        });
        router.replace("/app");
        return;
      }
      setStep("details");
      toast({
        tone: "success",
        title: "Email verified",
        description: "Add owner details to create your KoshPilot login.",
      });
    } catch (error) {
      toast({
        tone: "error",
        title: "OTP verification failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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

      <section className="container-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="order-2 animate-fade-up lg:order-1">
          <Badge tone="green">No card required to start</Badge>
          <h1 className="mt-6 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Start managing billing, stock, and cash with more confidence.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            KoshPilot helps Indian teams follow up receivables, keep GST-ready records, control inventory, and use AI to spot business actions before they slip.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [BadgeIndianRupee, "Track receivables faster"],
              [FileCheck2, "Keep GST-ready records"],
              [WalletCards, "Control stock and cash"],
            ].map(([Icon, label]) => (
              <Card key={label as string} className="p-5">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm font-semibold">{label as string}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-6 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black">{trialDaysLabel} free trial included</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your account first. Company setup starts after login, and no plan selection or payment is needed during signup.
                </p>
              </div>
              <Badge tone="green">{trialConfig?.aiCreditLimit ?? "Configured"} trial AI credits</Badge>
            </div>
          </Card>
        </div>

        <div className="order-1 mx-auto w-full max-w-xl lg:order-2">
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              ["email", "Email"],
              ["otp", "Verify"],
              ["details", "Profile"],
            ].map(([key, label], index) => {
              const active = step === key;
              const done = ["email", "otp", "details"].indexOf(step) > index;
              return (
                <div
                  key={key}
                  className={cn(
                    "rounded-2xl border p-3 text-center text-xs font-black",
                    active && "border-primary bg-primary/10 text-primary",
                    done && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {step === "email" ? (
            <FormCard
              title="Verify your work email"
              description="Use the email you want for owner or admin login. We will confirm it before asking for profile details."
              asForm
              showSuccessToast={false}
              onValidSubmit={(values) => sendOtp(values.email)}
            >
              <FormGrid columns={1}>
                <TextField label="Work email" name="email" required type="email" placeholder={email || "you@company.com"} autoComplete="email" />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </FormGrid>
            </FormCard>
          ) : null}

          {step === "otp" ? (
            <Card className="p-5">
              <h2 className="text-xl font-bold">Enter verification code</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>{devOtp ? <>. Local debug OTP: <span className="font-semibold text-foreground">{devOtp}</span></> : "."}
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
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !otp[index] && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                      }
                      if (event.key === "Enter" && enteredOtp.length === 6) {
                        verifyOtp();
                      }
                    }}
                  />
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button disabled={enteredOtp.length !== 6 || isSubmitting} onClick={verifyOtp}>
                  Verify OTP
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" disabled={isSubmitting} onClick={() => sendOtp(email)}>
                  Resend OTP
                </Button>
              </div>
              <button
                className="mt-4 text-sm font-semibold text-primary hover:underline"
                onClick={() => setStep("email")}
              >
                Change email address
              </button>
            </Card>
          ) : null}

          {step === "details" ? (
            <FormCard
              title="Finish owner profile"
              description="These details create your secure admin profile. Company GST, address, and financial year are collected next."
              asForm
              showSuccessToast={false}
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
                  const response = await registerAuthUser({
                    email,
                    name: values["full-name"],
                    password: values.password,
                  });
                  dispatch(setAuthUser(response.user));
                  if (trialConfig) {
                    dispatch(setAiPlan({ plan: "free-trial", limit: trialConfig.aiCreditLimit, used: 0 }));
                  }
                  toast({
                    tone: "success",
                    title: "Trial started",
                    description: `${values["full-name"]}, your ${trialDaysLabel} free trial is ready. Add your first company to finish setup.`,
                  });
                  window.setTimeout(() => router.push("/onboarding/company"), 650);
                } catch (error) {
                  toast({
                    tone: "error",
                    title: "Could not create account",
                    description: error instanceof Error ? error.message : "Please try again.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <FormGrid columns={1}>
                <TextField label="Full name" name="full-name" required minLength={3} placeholder="Your full name" autoComplete="name" />
                <TextField label="Verified email" name="email" required type="email" value={email} readOnly />
                <TextField label="Mobile number" name="phone" required type="tel" pattern="^(\\+91|91|0)?[\\s-]?[6-9][0-9]{4}[\\s-]?[0-9]{5}$" placeholder="+91 98765 43210" autoComplete="tel" />
                <TextField label="Password" name="password" required type="password" minLength={8} placeholder="Create a strong password" autoComplete="new-password" />
                <TextField label="Confirm password" name="confirm-password" required type="password" minLength={8} placeholder="Re-enter password" autoComplete="new-password" />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <LockKeyhole className="h-4 w-4" />
                  Start trial and continue
                  <Sparkles className="h-4 w-4" />
                </Button>
              </FormGrid>
            </FormCard>
          ) : null}
        </div>
      </section>
    </main>
  );
}
