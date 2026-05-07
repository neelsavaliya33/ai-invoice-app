import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  LifeBuoy,
  RefreshCw,
  Search,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";

type StatusPageProps = {
  code: "404" | "500";
  eyebrow: string;
  title: string;
  description: string;
  details: string[];
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  onRetry?: React.ReactNode;
};

const statusTone = {
  "404": {
    badge: "Page not found",
    icon: Search,
    accent: "from-primary/25 via-primary/10 to-secondary/15",
  },
  "500": {
    badge: "Server error",
    icon: AlertTriangle,
    accent: "from-secondary/25 via-destructive/10 to-primary/10",
  },
} as const;

export function StatusPage({
  code,
  eyebrow,
  title,
  description,
  details,
  primaryHref = "/app",
  primaryLabel = "Go to dashboard",
  secondaryHref = "/",
  secondaryLabel = "Back to home",
  onRetry,
}: StatusPageProps) {
  const tone = statusTone[code];
  const Icon = tone.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="container-shell flex min-h-screen flex-col py-6">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <BrandLogo priority className="h-12 w-[205px]" />
          </Link>
          <Badge tone={code === "404" ? "green" : "amber"}>{tone.badge}</Badge>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-fade-up">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {onRetry}
              <Link
                href={primaryHref}
                className={cn(
                  "inline-flex h-11 animate-scale-in items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring active:translate-y-0",
                  "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-soft",
                )}
              >
                <Home className="h-4 w-4" />
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className={cn(
                  "inline-flex h-11 animate-scale-in items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring active:translate-y-0",
                  "border bg-card text-foreground hover:bg-muted hover:shadow-sm",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                {secondaryLabel}
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden p-6 sm:p-8">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tone.accent}`}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-3 text-8xl font-black tracking-tight text-foreground sm:text-9xl">
                    {code}
                  </p>
                </div>
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-background/85 text-primary shadow-soft">
                  <Icon className="h-8 w-8" />
                </span>
              </div>

              <div className="mt-8 grid gap-3">
                {details.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border bg-background/75 p-4"
                  >
                    <LifeBuoy className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border bg-background/75 p-4">
                <p className="text-sm font-semibold">Need help?</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  If this keeps happening, share the page URL and the time of
                  the issue with support so the team can trace it quickly.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <RefreshCw className="h-4 w-4" />
      Try again
    </Button>
  );
}
