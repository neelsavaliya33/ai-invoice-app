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
import { aiPlans } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";
import { setAiPlan } from "@/store/store";
import { cn } from "@/lib/utils";

const freePlan = aiPlans.find((plan) => plan.id === "free") ?? aiPlans[0];
const DEMO_OTP = "246810";

type SignupStep = "email" | "otp" | "details";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("owner@koshpilot.in");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const enteredOtp = otp.join("");

  function sendOtp(nextEmail: string) {
    setEmail(nextEmail);
    setOtp(Array(6).fill(""));
    setStep("otp");
    toast({
      tone: "success",
      title: "Verification code sent",
      description: `Use ${DEMO_OTP} for this local demo. In production, this code is delivered to ${nextEmail}.`,
    });
  }

  function verifyOtp() {
    if (enteredOtp !== DEMO_OTP) {
      toast({
        tone: "error",
        title: "Code does not match",
        description: `For this local demo, enter ${DEMO_OTP} to continue.`,
      });
      return;
    }

    setStep("details");
    toast({
      tone: "success",
      title: "Email verified",
      description: "Add owner details to create your KoshPilot login.",
    });
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
                <p className="font-black">Free workspace included</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with {freePlan.aiCreditLimit} common AI credits and sample workflows before choosing a paid plan.
                </p>
              </div>
              <Badge tone="green">{freePlan.name}</Badge>
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
                <TextField label="Work email" name="email" required type="email" defaultValue={email} />
                <Button type="submit" className="w-full">
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
                Enter the 6-digit code for <span className="font-semibold text-foreground">{email}</span>. For this demo, use <span className="font-semibold text-foreground">{DEMO_OTP}</span>.
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
                <Button disabled={enteredOtp.length !== 6} onClick={verifyOtp}>
                  Verify OTP
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" onClick={() => sendOtp(email)}>
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
              onValidSubmit={(values) => {
                dispatch(setAiPlan({ plan: "free", limit: freePlan.aiCreditLimit, used: 0 }));
                toast({
                  tone: "success",
                  title: "Account ready",
                  description: `${values["full-name"]}, add your first company to finish setup.`,
                });
                window.setTimeout(() => router.push("/onboarding/company"), 650);
              }}
            >
              <FormGrid columns={1}>
                <TextField label="Full name" name="full-name" required minLength={3} defaultValue="Neel Savaliya" />
                <TextField label="Verified email" name="email" required type="email" value={email} readOnly />
                <TextField label="Mobile number" name="phone" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" defaultValue="+91 98765 43210" />
                <TextField label="Password" name="password" required type="password" minLength={8} defaultValue="demo@1234" />
                <TextField label="Confirm password" name="confirm-password" required type="password" minLength={8} defaultValue="demo@1234" />
                <Button type="submit" className="w-full">
                  <LockKeyhole className="h-4 w-4" />
                  Create account and continue
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
