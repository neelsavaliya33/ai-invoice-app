import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { industries } from "@/lib/data";

function HeroArt() {
  return (
    <Card className="relative min-h-[430px] overflow-hidden bg-blue-50 p-6 dark:bg-slate-900">
      <div className="animate-float-soft absolute right-10 top-10 h-24 w-24 rotate-12 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-700 shadow-soft [--rotate:12deg]" />
      <div className="animate-float-soft stagger-2 absolute right-44 top-24 h-20 w-20 -rotate-12 rounded-3xl bg-gradient-to-br from-blue-300 to-blue-700 shadow-soft [--rotate:-12deg]" />
      <div className="animate-float-soft stagger-3 absolute bottom-20 right-16 h-28 w-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-white shadow-soft" />
      <div className="relative mt-28 animate-fade-up rounded-3xl border bg-card/90 p-5 shadow-soft backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold">Today command center</p>
            <p className="text-xs text-muted-foreground">Live business health</p>
          </div>
          <Badge tone="violet">AI ready</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Receivables", "INR 2.8L"],
            ["Sales", "INR 9.4L"],
            ["Low stock", "12 SKUs"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border bg-background p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-2 font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-accent/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Bot className="h-4 w-4" />
            AI Copilot
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Collect INR 1.74L from overdue invoices and reorder cotton roll A-12 before weekend demand.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">
        Launch offer: AI-assisted billing for growing businesses
      </div>
      <header className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">LedgerAI</Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground lg:flex">
          <a href="#features">Features</a>
          <a href="#industries">Industries</a>
          <a href="#pricing">Pricing</a>
          <a href="#security">Security</a>
          <a href="#support">Support</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost">Sign in</Button>
          <Link className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" href="/app">
            Start free
          </Link>
        </div>
      </header>
      <main>
        <section className="container-shell grid gap-12 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Badge tone="green">System theme, rounded shadcn workflow</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
              Billing, inventory, reports, and AI guidance in one clean workspace
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Create GST-ready invoices, manage customers, monitor stock, understand reports, and ask an AI Copilot what your business should do next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" href="/app">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Button variant="secondary">View workflows</Button>
            </div>
          </div>
          <div className="animate-fade-up stagger-2">
            <HeroArt />
          </div>
        </section>

        <section className="container-shell grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["10k+", "businesses"],
            ["50L", "invoices processed"],
            ["95%", "renewal intent"],
            ["24", "industries supported"],
          ].map(([value, label]) => (
            <Card key={label} className="p-6">
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </Card>
          ))}
        </section>

        <section id="features" className="container-shell py-16">
          <h2 className="text-3xl font-bold">Everything your daily workflow needs</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["GST-ready invoices", "Customer ledgers", "Inventory alerts", "AI Copilot", "Reports", "Team roles"].map((feature) => (
              <Card key={feature} className="p-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{feature}</h3>
                <p className="mt-2 text-sm text-muted-foreground">Rounded, production-ready screens with clear actions and realistic business data.</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="industries" className="container-shell py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Built for 24 MSME categories</h2>
              <p className="mt-2 text-muted-foreground">Each category can drive onboarding, fields, reports, and AI prompt examples.</p>
            </div>
            <Sparkles className="hidden h-10 w-10 text-accent sm:block" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map(([name, benefit, Icon]) => (
              <Card key={name} className="p-5">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{benefit}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="container-shell py-16">
          <h2 className="text-3xl font-bold">Simple plans</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {["Starter", "Growth", "Business"].map((plan, index) => (
              <Card key={plan} className={`p-6 ${index === 1 ? "ring-2 ring-primary" : ""}`}>
                {index === 1 ? <Badge tone="green">Recommended</Badge> : null}
                <h3 className="mt-4 text-2xl font-bold">{plan}</h3>
                <p className="mt-2 text-muted-foreground">For {index === 0 ? "new businesses" : index === 1 ? "growing teams" : "multi-user operations"}.</p>
                <p className="mt-6 text-3xl font-bold">INR {index === 0 ? "0" : index === 1 ? "3,500" : "8,500"}<span className="text-sm font-medium text-muted-foreground"> / year</span></p>
                <Button className="mt-6 w-full">Choose {plan}</Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
