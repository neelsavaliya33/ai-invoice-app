"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Globe2,
  Headphones,
  Landmark,
  MessageCircle,
  PackageCheck,
  PlayCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { aiPlans, industries, planAddOns } from "@/lib/data";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";

const simplicity = [
  ["Access from the web", "Your billing, inventory, accounts, payroll, and dispatch data stays ready across office and counter workflows."],
  ["Easy for non-accountants", "Simple forms, guided validation, and plain-language reports help owners and staff work without accounting confusion."],
  ["Fast daily operations", "Create bills, check stock, collect dues, prepare e-way drafts, and read AI summaries in minutes."],
] as const;

const features = [
  ["Invoices", "Create GST-ready invoices, add HSN/SAC, due dates, payment details, PDF previews, and WhatsApp-ready reminders.", ReceiptText],
  ["Expenses", "Capture vendor bills, categories, GST rates, approvals, reimbursements, and payment status.", CreditCard],
  ["Complete sales workflow", "Manage quotations, sale orders, invoices, credit/debit notes, payments, and customer balances.", FileText],
  ["Inventory", "Track stock, reorder levels, SKU value, serial numbers, expiry, batches, and low-stock AI alerts.", PackageCheck],
  ["Accounting", "Connect ledgers, receivables, payables, bank reconciliation, advances, GST payable, and audit trail.", Landmark],
  ["E-way bill", "Generate transport-ready e-way bill drafts from invoice, vehicle, GSTIN, distance, and dispatch details.", Truck],
  ["Reports", "Review sales, profit/loss, inventory detail, GST summaries, receivables, payables, expenses, and stock value.", BarChart3],
  ["AI Copilot", "Ask for invoice drafts, overdue collection plans, stock risk checks, report explanations, and next actions.", Bot],
] as const;

const reportTags = [
  "Profit Loss",
  "Purchase Detail",
  "Inventory Detail",
  "Balance Sheet",
  "Expense",
  "GSTR 1 Report",
  "Statement",
  "Income",
  "GSTR 3B Report",
  "Contact Receivables",
  "Sale Detail",
  "Stock",
] as const;

const supportItems = [
  ["Available every day", "Get help when invoices, dispatch, collections, or month-end reports cannot wait.", Clock],
  ["Talk to a human", "No confusing IVR-first experience. Make support feel direct and business-friendly.", MessageCircle],
  ["Support in your language", "Design the workflow for English, Hindi, and Gujarati support conversations.", Globe2],
  ["Free guided support", "Help users set up company data, inventory, customers, invoice settings, and AI credits.", Headphones],
] as const;

function ScrollRevealRuntime() {
  useEffect(() => {
    document.documentElement.classList.add("js-reveal-ready");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );
    nodes.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 45}ms`);
      observer.observe(node);
    });
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("js-reveal-ready");
    };
  }, []);

  return null;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <ScrollRevealRuntime />

      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-shell flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black text-primary">
            <BrandLogo priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground lg:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <a href="#industries" className="hover:text-foreground">Industries</a>
            <a href="#support" className="hover:text-foreground">Support</a>
          </nav>
          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />
            <Link className="hidden h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex" href="/login">
              Login
            </Link>
            <Link className="hidden h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft sm:inline-flex" href="/app">
              Book Demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container-shell grid gap-12 py-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="scroll-reveal">
            <Badge tone="green">AI-powered GST billing for Indian MSMEs</Badge>
            <h1 className="text-balance mt-6 max-w-5xl break-words text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
              <span className="block sm:inline">Easy Invoicing,</span>{" "}
              <span className="block sm:inline">Inventory,</span>{" "}
              <span className="block sm:inline">Accounting & AI</span>
              <span className="block text-primary">for small businesses in India</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Simplify your business with GST-ready invoices, inventory tracking, accounting workflows, e-way bill drafts, payroll, reports, and an AI Copilot in one easy-to-use app.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5" href="/signup">
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-card px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-muted" href="#features">
                <PlayCircle className="h-4 w-4" /> Video Tour
              </Link>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:flex sm:flex-wrap">
              {["10,000+ business-ready workflow", "English + Gujarati", "Common AI credit wallet", "Dark and light mode"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="scroll-reveal">
            <Image
              src="/images/ledgerai-customer-hero.png"
              alt="Indian small business owners using KoshPilot billing and inventory web app"
              width={1200}
              height={900}
              priority
              className="h-auto w-full rounded-[2rem] border object-cover shadow-soft"
            />
          </div>
        </section>

        <section className="container-shell py-8">
          <div className="scroll-reveal text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Trusted by growing MSME teams</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Smarter Invoicing", ReceiptText],
                ["Powerful Inventory", PackageCheck],
                ["Effortless Accounting", WalletCards],
              ].map(([label, Icon]) => (
                <Card key={label as string} className="p-6">
                  <Icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-4 font-black">{label as string}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-band py-20">
          <div className="container-shell">
            <div className="scroll-reveal max-w-3xl">
              <h2 className="text-balance text-4xl font-black lg:text-5xl">Designed for simplicity & speed</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Give owners, accountants, sales staff, stock managers, and dispatch teams a workspace that feels easy from the first click.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {simplicity.map(([title, body]) => (
                <Card key={title} className="scroll-reveal p-6">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-2xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="container-shell py-20">
          <div className="scroll-reveal max-w-3xl">
            <h2 className="text-balance text-4xl font-black lg:text-5xl">Powerful features built for your business success</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              KoshPilot brings everyday business modules together and adds AI where it saves time: summaries, drafts, risk flags, and suggested actions.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, body, Icon]) => (
              <Card key={title} className="scroll-reveal group p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                <Link href="/app" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section className="landing-band py-20">
          <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="scroll-reveal">
              <h2 className="text-balance text-4xl font-black lg:text-5xl">Reports that help you manage every part of the business</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                From profit and loss to GST readiness, stock value, purchases, receivables, and expenses, your reports should turn data into decisions.
              </p>
              <Link href="/app/reports" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
                See all reports <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="scroll-reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reportTags.map((tag) => (
                <div key={tag} className="rounded-2xl border bg-card p-4 text-sm font-bold">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="scroll-reveal">
            <Image
              src="/images/ledgerai-customer-mobile.png"
              alt="Indian shop owner reviewing invoices and stock alerts"
              width={900}
              height={900}
              className="mx-auto aspect-square w-full max-w-lg rounded-[2rem] border object-cover shadow-soft"
            />
          </div>
          <div className="scroll-reveal">
            <Badge tone="blue">Web workspace workflow</Badge>
            <h2 className="text-balance mt-4 text-4xl font-black lg:text-5xl">Run daily work from one browser dashboard</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Sales staff can check customer balances, shop counters can create quick invoices, dispatch teams can verify transport details, and owners can approve payroll or AI actions from the web app.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Quick invoice creation", "Customer balance before visit", "Low-stock alert", "AI summary before collection call"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="industries" className="landing-band py-20">
          <div className="container-shell">
            <div className="scroll-reveal text-center">
              <h2 className="text-balance text-4xl font-black lg:text-5xl">KoshPilot helps business in any industry</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
                Start with industry-aware sample fields, workflows, reports, and AI prompts for common Indian MSME categories.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map(([name, benefit, Icon]) => (
                <Card key={name} className="scroll-reveal flex items-center gap-4 p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black">{name}</h3>
                    <p className="text-xs text-muted-foreground">{benefit}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/app" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="container-shell py-20">
          <div className="scroll-reveal">
            <Badge tone="green">Competitive web-app pricing</Badge>
            <h2 className="text-balance mt-4 text-4xl font-black lg:text-5xl">Affordable annual plans for Indian MSMEs</h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Start free, try Professional for 14 days without a card, then choose a web plan with clear user limits, company limits, e-way bill allowance, and monthly AI credits.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiPlans.map((plan) => (
              <Card key={plan.id} className={`scroll-reveal relative p-5 ${plan.recommended ? "border-primary bg-primary/10" : ""}`}>
                {plan.recommended ? <Badge tone="green" className="absolute right-4 top-4">Best for most</Badge> : null}
                <p className="text-lg font-black">{plan.name}</p>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                <p className="mt-5 text-3xl font-black text-primary">{plan.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.billingPeriod}</p>
                <div className="mt-5 grid gap-2 text-sm">
                  <span className="font-semibold">{plan.userLimit} user{plan.userLimit > 1 ? "s" : ""}</span>
                  <span className="font-semibold">{plan.companyLimit}{plan.id === "business" ? "+" : ""} compan{plan.companyLimit > 1 ? "ies" : "y"}</span>
                  <span className="font-semibold">{plan.aiCreditLimit.toLocaleString("en-IN")} AI credits/month</span>
                  <span className="font-semibold">{plan.ewayBillLimit.toLocaleString("en-IN")} e-way bills</span>
                </div>
                <div className="mt-5 grid gap-2">
                  {plan.featureHighlights.map((item) => (
                    <span key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-2 border-t pt-4">
                  {plan.featureDetails.slice(0, 3).map((item) => (
                    <span key={item} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
                <Link href="/signup" className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground">
                  {plan.id === "free" ? "Start free" : plan.id === "business" ? "Contact sales" : "Try 14 days"}
                </Link>
              </Card>
            ))}
          </div>
          <Card className="scroll-reveal mt-6 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-black">Flexible add-ons</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add seats, AI credits, e-way bills, or another company without forcing a full upgrade.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {planAddOns.map((addOn) => <Badge key={addOn.id} tone="blue">{addOn.name}: {addOn.price}</Badge>)}
              </div>
            </div>
          </Card>
        </section>

        <section id="support" className="landing-band py-20">
          <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="scroll-reveal">
                <h2 className="text-balance text-4xl font-black lg:text-5xl">We support you at every step</h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  A business tool only works when teams can get help quickly. Design support for real users, real questions, and real business pressure.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {supportItems.map(([title, body, Icon]) => (
                  <Card key={title} className="scroll-reveal p-5">
                    <Icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </Card>
                ))}
              </div>
            </div>
            <Image
              src="/images/ledgerai-customer-support.png"
              alt="Accountant helping a business owner understand GST reports and invoices"
              width={1000}
              height={720}
              className="scroll-reveal aspect-[4/3] w-full rounded-[2rem] border object-cover shadow-soft"
            />
          </div>
        </section>

        <section className="container-shell py-20">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["95%", "Renewal intent"],
              ["10,000+", "Businesses-ready workflow"],
              ["50,00,000", "Invoice-scale data modeled"],
            ].map(([value, label]) => (
              <Card key={label} className="scroll-reveal p-6 text-center">
                <p className="text-5xl font-black text-primary">{value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container-shell pb-20">
          <div className="scroll-reveal overflow-hidden rounded-[2rem] border border-primary/30 bg-primary p-6 text-slate-950 shadow-soft md:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
              <div>
                <Badge className="bg-white/35 text-slate-950">Try KoshPilot for free</Badge>
                <h2 className="text-balance mt-5 max-w-3xl text-4xl font-black leading-tight lg:text-5xl">Try KoshPilot for 14 days and decide which plan suits your business</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-800">
                  Explore invoices, inventory, accounting, e-way bills, payroll, reports, settings, and AI Copilot with local sample data.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5" href="/app">
                    Start Free <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-950/20 bg-white/20 px-5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-white/35" href="#features">
                    See all features
                  </Link>
                </div>
              </div>
              <Card className="border-slate-950/15 bg-white p-6 text-slate-950 shadow-2xl">
                <p className="text-sm font-bold text-primary">14 Days Professional Trial</p>
                <p className="mt-3 text-5xl font-black text-slate-950">Rs. 0</p>
                <p className="mt-2 text-sm text-slate-500">No card required. Account stays on Free unless upgraded.</p>
                <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700">
                  {["Access all demo features", "Set up with sample data", "Free workflow support"].map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container-shell grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3 text-2xl font-black text-primary">
              <BrandLogo />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Easy invoicing, accounting, inventory, payroll, e-way bill, and AI workflows for micro and small businesses in India.
            </p>
          </div>
          <div>
            <h3 className="font-black">Product</h3>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link href="/pricing">Pricing</Link>
              <a href="#features">All Features</a>
              <a href="#industries">Industries</a>
              <Link href="/app">Web Application</Link>
            </div>
          </div>
          <div>
            <h3 className="font-black">Company</h3>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link href="/app">Book Demo</Link>
              <Link href="/login">Login</Link>
              <a href="#support">Support</a>
              <Link href="/signup">Start Free</Link>
            </div>
          </div>
          <div>
            <h3 className="font-black">Support</h3>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Everyday support</span>
              <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-primary" /> Human help</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure workflows</span>
            </div>
          </div>
        </div>
        <div className="container-shell mt-10 border-t pt-6 text-sm text-muted-foreground">
          Copyright © 2026 KoshPilot demo. Original UI inspired by modern MSME billing products.
        </div>
      </footer>
    </div>
  );
}
