"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Bot, Boxes, BriefcaseBusiness, Building2, CreditCard, FileText, Gauge, HandCoins, Landmark, ReceiptText, Search, Settings, ShoppingBag, Truck, Users, UserCog, ChartNoAxesCombined } from "lucide-react";
import { setAiOpen } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { ThemeToggle } from "./theme-toggle";
import { AiCopilot } from "./ai-copilot";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { LanguageToggle } from "./language-toggle";
import { TranslationKey, useI18n } from "@/lib/i18n";
import { CreditWalletButton } from "./credit-system";
import { BrandMark } from "./brand-logo";
import { GstCalculator } from "./gst-calculator";

const nav = [
  { href: "/app", labelKey: "dashboard", icon: Gauge, shortcut: "1" },
  { href: "/app/invoices", labelKey: "invoices", icon: FileText, shortcut: "2" },
  { href: "/app/customers", labelKey: "customers", icon: Users, shortcut: "3" },
  { href: "/app/inventory", labelKey: "inventory", icon: Boxes, shortcut: "4" },
  { href: "/app/accounting", labelKey: "accounting", icon: Landmark, shortcut: "5" },
  { href: "/app/expenses", labelKey: "expenses", icon: ReceiptText, shortcut: "6" },
  { href: "/app/purchases", labelKey: "purchases", icon: ShoppingBag, shortcut: "7" },
  { href: "/app/payments", labelKey: "payments", icon: CreditCard, shortcut: "8" },
  { href: "/app/banking", labelKey: "banking", icon: Building2, shortcut: "9" },
  { href: "/app/tax", labelKey: "taxGst", icon: FileText, shortcut: "0" },
  { href: "/app/eway-bills", labelKey: "ewayBills", icon: Truck, shortcut: "Q" },
  { href: "/app/reports", labelKey: "reports", icon: ChartNoAxesCombined, shortcut: "W" },
  { href: "/app/users", labelKey: "userManagement", icon: UserCog, shortcut: "E" },
  { href: "/app/employees", labelKey: "employees", icon: BriefcaseBusiness, shortcut: "R" },
  { href: "/app/payroll", labelKey: "payroll", icon: HandCoins, shortcut: "T" },
  { href: "/app/settings", labelKey: "settings", icon: Settings, shortcut: "Y" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useI18n();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      const isCalculatorOpen = Boolean(document.querySelector("[data-gst-calculator-panel='true']"));
      if (isTypingField || isCalculatorOpen || !event.altKey || event.ctrlKey || event.metaKey) return;

      const matchedItem = nav.find((item) => item.shortcut.toLowerCase() === event.key.toLowerCase());
      if (!matchedItem) return;

      event.preventDefault();
      router.push(matchedItem.href);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 animate-fade-up overflow-y-auto border-r bg-card p-4 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl bg-primary/10 p-3 text-primary">
          <BrandMark />
          <div>
            <p className="font-bold text-foreground">KoshPilot</p>
            <p className="text-xs text-muted-foreground">{t("invoiceOs")}</p>
          </div>
        </Link>
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{t(item.labelKey as TranslationKey)}</span>
                <kbd
                  className={cn(
                    "rounded-md border px-1.5 py-0.5 text-[10px] font-black text-muted-foreground",
                    active && "border-primary-foreground/25 text-primary-foreground/80",
                  )}
                >
                  Alt {item.shortcut}
                </kbd>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
            <div className="hidden flex-1 items-center gap-3 rounded-2xl border bg-card px-3 lg:flex">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder={t("searchPlaceholder")} />
            </div>
            <Button variant="secondary" onClick={() => dispatch(setAiOpen(true))}>
              <Bot className="h-5 w-5 shrink-0" aria-hidden="true" />
              {t("aiCopilot")}
            </Button>
            <CreditWalletButton />
            <GstCalculator />
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" className="h-11 w-11 p-0">
              <Bell className="h-5 w-5 shrink-0" aria-hidden="true" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-sm font-bold outline-none ring-ring transition hover:bg-muted/80 focus:ring-2">
                  NS
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <span className="block text-sm text-foreground">Neel Savaliya</span>
                  <span className="block text-xs font-normal">{t("ownerAccount")}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem>{t("companySettings")}</DropdownMenuItem>
                <DropdownMenuItem>{t("keyboardShortcuts")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">{t("signOut")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="animate-fade-up p-4 sm:p-6">{children}</main>
      </div>
      <AiCopilot />
    </div>
  );
}
