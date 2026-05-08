"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, Card, DataTable } from "@/components/ui";
import { type UiPlan, usePlanAddOns, usePlans, useTrialConfig } from "@/lib/use-plans";

const includedFeatures = [
  "GST invoices and customer/vendor ledgers",
  "Inventory, SKU, serial number, and reorder tracking",
  "Accounting, banking, payments, purchases, and expenses",
  "Reports including profit loss, balance sheet, stock, GSTR, receivables, and payables",
  "Common AI credit wallet for invoice drafts, summaries, reminders, and risk checks",
  "Web-app access with dark mode, multilingual UI, and role-based users",
] as const;

const faqItems = [
  ["Is there a mobile app?", "No. KoshPilot pricing is for the web app only right now."],
  ["Do AI credits reset?", "Yes. Included AI credits reset every month for the selected company plan."],
  ["Do invited users count?", "Yes. Active users and pending invited users both count toward the user limit."],
  ["What happens after the trial?", "The account stays on the Free plan unless the owner upgrades. No card is required for trial signup."],
] as const;

function planGridClass(planCount: number) {
  if (planCount <= 1) return "mx-auto max-w-md";
  if (planCount === 2) return "mx-auto max-w-5xl md:grid-cols-2";
  if (planCount === 3) return "mx-auto max-w-6xl md:grid-cols-2 xl:grid-cols-3";
  return "md:grid-cols-2 xl:grid-cols-4";
}

function primaryLimitRows(plan: UiPlan) {
  return [
    [Users, plan.userLimitLabel],
    [Building2, plan.companyLimitLabel],
    [Sparkles, `${plan.aiCreditLimit.toLocaleString("en-IN")} AI credits/month`],
    [Truck, `${plan.ewayBillLimit.toLocaleString("en-IN")} e-way bills`],
  ] as const;
}

export default function PricingPage() {
  const { plans } = usePlans();
  const { addOns } = usePlanAddOns();
  const { trialConfig } = useTrialConfig();
  const recommendedPlan = plans.find((plan) => plan.recommended) ?? plans[0];
  const trialPlanName = trialConfig?.planName ?? "trial";
  const trialDays = trialConfig?.trialDays;
  const trialDaysLabel = trialDays ? `${trialDays} days` : "your configured trial";

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-shell flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground lg:flex">
            <Link href="/#features" className="hover:text-foreground">Features</Link>
            <Link href="/pricing" className="text-foreground">Pricing</Link>
            <Link href="/#industries" className="hover:text-foreground">Industries</Link>
            <Link href="/#support" className="hover:text-foreground">Support</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <Link className="hidden h-11 items-center rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex" href="/login">
              Login
            </Link>
            <Link className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft" href="/signup">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      <section className="container-shell py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge tone="green">Competitive web-app pricing</Badge>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Simple annual plans for Indian MSMEs
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Start free, try {trialPlanName} for {trialDaysLabel}, and upgrade only when you need more users,
            companies, e-way bills, or AI credits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground shadow-soft" href="/signup">
              Start without payment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="inline-flex h-12 items-center rounded-xl border bg-card px-5 text-sm font-black" href="/app">
              View demo workspace
            </Link>
          </div>
        </div>

        {!plans.length ? (
          <Card className="mx-auto mt-12 max-w-2xl p-6 text-center">
            <h2 className="text-2xl font-black">Pricing plans are loading from backend</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Start the backend, run migrations, and seed plans to display the live plan catalog here.
            </p>
          </Card>
        ) : null}

        {plans.length ? <div className={`mt-12 grid gap-4 ${planGridClass(plans.length)}`}>
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative flex flex-col p-5 ${plan.recommended ? "border-primary bg-primary/10" : ""}`}>
              {plan.recommended ? (
                <Badge tone="green" className="absolute right-4 top-4">Best for most</Badge>
              ) : null}
              <p className="text-xl font-black">{plan.name}</p>
              <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <div className="mt-5">
                <p className="text-4xl font-black text-primary">{plan.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.billingPeriod}</p>
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl border bg-background p-4 text-sm">
                {primaryLimitRows(plan).map(([Icon, label]) => (
                  <span key={label} className="flex items-center gap-2 font-semibold">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-2">
                {plan.featureHighlights.map((feature) => (
                  <span key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    {feature}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid flex-1 content-start gap-2 border-t pt-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Included</p>
                {plan.featureDetails.map((feature) => (
                  <span key={feature} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary" />
                    {feature}
                  </span>
                ))}
                {plan.modules.length ? (
                  <p className="pt-2 text-xs font-semibold text-muted-foreground">
                    {plan.modules.length} modules · {plan.capabilityCount} capabilities enabled
                  </p>
                ) : null}
              </div>
              <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground" href="/signup">
                {plan.ctaLabel}
              </Link>
            </Card>
          ))}
        </div> : null}
      </section>

      {recommendedPlan ? <section className="container-shell pb-16">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-primary p-6 text-primary-foreground md:p-8">
              <Badge className="bg-white/25 text-primary-foreground">{recommendedPlan.name} details</Badge>
              <h2 className="mt-5 text-3xl font-black">{recommendedPlan.name} is the recommended growth plan</h2>
              <p className="mt-4 text-sm leading-7 text-primary-foreground/80">
                It covers {recommendedPlan.companyLimitLabel}, {recommendedPlan.userLimitLabel}, {recommendedPlan.ewayBillLimit.toLocaleString("en-IN")} e-way bills, and {recommendedPlan.aiCreditLimit.toLocaleString("en-IN")} monthly AI credits based on the latest backend plan catalog.
              </p>
              <div className="mt-6 grid gap-3 text-sm font-bold">
                <span>{recommendedPlan.companyLimitLabel}</span>
                <span>{recommendedPlan.userLimitLabel}</span>
                <span>{recommendedPlan.aiCreditLimit.toLocaleString("en-IN")} shared AI credits/month</span>
                <span>{recommendedPlan.ewayBillLimit.toLocaleString("en-IN")} e-way bill drafts</span>
              </div>
            </div>
            <div className="grid gap-3 p-6 md:grid-cols-2 md:p-8">
              {(recommendedPlan?.featureDetails ?? []).map((feature) => (
                <div key={feature} className="rounded-2xl border bg-background p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold leading-6">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section> : null}

      <section className="landing-band py-16">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge tone="blue">What is included</Badge>
            <h2 className="mt-4 text-3xl font-black">Every plan is built for real daily workflow</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              KoshPilot keeps pricing competitive by charging annually per company and letting teams add only the limits they need.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {includedFeatures.map((feature) => (
              <Card key={feature} className="p-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold leading-6">{feature}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge tone="violet">Add-ons</Badge>
            <h2 className="mt-4 text-3xl font-black">Upgrade one limit at a time</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Use add-ons when you only need one more seat, more AI credits, more e-way bills, or another company.
            </p>
          </div>
          <Badge tone="green">No payment integration in demo</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {addOns.map((addOn) => (
            <Card key={addOn.id} className="p-5">
              <BadgeIndianRupee className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-black">{addOn.name}</h3>
              <p className="mt-2 text-2xl font-black text-primary">{addOn.price}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{addOn.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {recommendedPlan ? <section className="container-shell pb-16">
        <Card className="p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Plan comparison</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {recommendedPlan.name} is recommended for most businesses because it balances users, AI credits, and e-way bill allowance.
              </p>
            </div>
            <Badge tone="green">{recommendedPlan.name} recommended</Badge>
          </div>
          <DataTable
            headers={["Plan", "Annual price", "Users", "Companies", "AI credits", "E-way bills", "Trial"]}
            rows={plans.map((plan) => [
              <span key="plan" className="font-black">{plan.name}</span>,
              plan.price,
              plan.userLimitLabel,
              plan.companyLimitLabel,
              plan.aiCreditLimit.toLocaleString("en-IN"),
              plan.ewayBillLimit.toLocaleString("en-IN"),
              plan.isFree ? "Free forever" : trialDaysLabel,
            ])}
          />
        </Card>
      </section> : null}

      <section className="container-shell pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map(([question, answer]) => (
            <Card key={question} className="p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-black">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
