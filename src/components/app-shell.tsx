"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Bot, Boxes, BriefcaseBusiness, Building2, ChevronDown, CreditCard, FileText, Gauge, HandCoins, Landmark, Menu, ReceiptText, Search, Settings, ShoppingBag, Sparkles, Truck, Users, UserCog, X, ChartNoAxesCombined } from "lucide-react";
import { clearAuthUser, setAiOpen, setAuthStatus, setAuthUser } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { ThemeToggle } from "./theme-toggle";
import { AiCopilot } from "./ai-copilot";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { LanguageToggle } from "./language-toggle";
import { TranslationKey, useI18n } from "@/lib/i18n";
import { useCreditWallet } from "./credit-system";
import { BrandMark } from "./brand-logo";
import { GstCalculator } from "./gst-calculator";
import { customers, employees, ewayBills, inventory, invoices, reports, users } from "@/lib/data";
import { CompanySwitcher, useActiveCompany, useRegisteredCompanies } from "./company-switcher";
import { clearAuthTokens, fetchAuthProfile, getAccessToken, getRefreshToken, logoutAuthUser } from "@/lib/api";
import { toast } from "./toast";

type NavItem = {
  href: string;
  label?: string;
  labelKey?: TranslationKey;
  icon: typeof Gauge;
  shortcut: string;
};

type NavSection = {
  id: string;
  label: string;
  icon: typeof Gauge;
  items: NavItem[];
};

const primaryNav: NavItem[] = [
  { href: "/app", labelKey: "dashboard", icon: Gauge, shortcut: "1" },
  { href: "/app/customers", labelKey: "customers", icon: Users, shortcut: "3" },
  { href: "/app/inventory", labelKey: "inventory", icon: Boxes, shortcut: "4" },
  { href: "/app/reports", labelKey: "reports", icon: ChartNoAxesCombined, shortcut: "W" },
];

const navSections: NavSection[] = [
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingBag,
    items: [
      { href: "/app/invoices", labelKey: "invoices", icon: FileText, shortcut: "2" },
      { href: "/app/quotations", label: "Quotations", icon: FileText, shortcut: "A" },
      { href: "/app/sale-orders", label: "Sale orders", icon: ShoppingBag, shortcut: "B" },
      { href: "/app/delivery-challans", label: "Delivery challans", icon: Truck, shortcut: "C" },
      { href: "/app/sale-credit-notes", label: "Credit notes", icon: ReceiptText, shortcut: "D" },
      { href: "/app/sale-debit-notes", label: "Debit notes", icon: ReceiptText, shortcut: "F" },
    ],
  },
  {
    id: "purchases",
    label: "Purchases",
    icon: ShoppingBag,
    items: [
      { href: "/app/purchases", labelKey: "purchases", icon: ShoppingBag, shortcut: "7" },
      { href: "/app/purchase-orders", label: "Purchase orders", icon: ShoppingBag, shortcut: "L" },
      { href: "/app/purchase-invoices", label: "Purchase invoices", icon: ShoppingBag, shortcut: "M" },
      { href: "/app/purchase-debit-notes", label: "Debit notes", icon: ReceiptText, shortcut: "N" },
      { href: "/app/purchase-credit-notes", label: "Credit notes", icon: ReceiptText, shortcut: "O" },
    ],
  },
  {
    id: "money",
    label: "Money",
    icon: CreditCard,
    items: [
      { href: "/app/expenses", labelKey: "expenses", icon: ReceiptText, shortcut: "6" },
      { href: "/app/incomes", label: "Incomes", icon: ReceiptText, shortcut: "K" },
      { href: "/app/payments", labelKey: "payments", icon: CreditCard, shortcut: "8" },
      { href: "/app/bank-accounts", label: "Bank accounts", icon: Landmark, shortcut: "P" },
      { href: "/app/bank-transfers", label: "Bank transfers", icon: Landmark, shortcut: "S" },
      { href: "/app/loans-advances", label: "Loans & advances", icon: HandCoins, shortcut: "U" },
      { href: "/app/settlements", label: "Settlements", icon: HandCoins, shortcut: "V" },
      { href: "/app/banking", labelKey: "banking", icon: Building2, shortcut: "9" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting",
    icon: Landmark,
    items: [
      { href: "/app/accounting", labelKey: "accounting", icon: Landmark, shortcut: "5" },
      { href: "/app/custom-accounts", label: "Custom accounts", icon: Landmark, shortcut: "H" },
      { href: "/app/journal-vouchers", label: "Journal vouchers", icon: FileText, shortcut: "J" },
      { href: "/app/tax", labelKey: "taxGst", icon: FileText, shortcut: "0" },
      { href: "/app/eway-bills", labelKey: "ewayBills", icon: Truck, shortcut: "Q" },
    ],
  },
  {
    id: "team",
    label: "Team & settings",
    icon: UserCog,
    items: [
      { href: "/app/users", labelKey: "userManagement", icon: UserCog, shortcut: "E" },
      { href: "/app/team", label: "Team", icon: Users, shortcut: "I" },
      { href: "/app/employees", labelKey: "employees", icon: BriefcaseBusiness, shortcut: "R" },
      { href: "/app/payroll", labelKey: "payroll", icon: HandCoins, shortcut: "T" },
      { href: "/app/settings", labelKey: "settings", icon: Settings, shortcut: "Y" },
      { href: "/app/subscription", label: "Subscription", icon: CreditCard, shortcut: "Z" },
    ],
  },
];

const nav = [...primaryNav, ...navSections.flatMap((section) => section.items)];

function navLabel(item: NavItem, t: (key: TranslationKey) => string) {
  return item.label ?? t(item.labelKey as TranslationKey);
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || (href !== "/app" && pathname.startsWith(href));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.ui.authUser);
  const authStatus = useAppSelector((state) => state.ui.authStatus);
  const { t } = useI18n();
  const activeCompany = useActiveCompany();
  const companyGateToastShown = useRef(false);
  const {
    data: registeredCompanies,
    isLoading: companiesLoading,
    isError: companiesError,
    isUsingFallback: usingCompanyFallback,
    hasAuthTokens,
  } = useRegisteredCompanies();
  const { remaining } = useCreditWallet();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navSections.map((section) => [section.id, false])),
  );
  const profileInitials = useMemo(() => {
    const source = authUser?.name || authUser?.email || "KP";
    const parts = source.replace(/@.*/, "").trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
  }, [authUser]);
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return [
      ...invoices.map((item) => ({ label: `${item.id} · ${item.customer}`, type: "Invoice", href: "/app/invoices" })),
      ...customers.map((item) => ({ label: `${item.name} · ${item.gstin}`, type: "Customer", href: "/app/customers" })),
      ...inventory.map((item) => ({ label: `${item.sku} · ${item.name}`, type: "Inventory", href: "/app/inventory" })),
      ...ewayBills.map((item) => ({ label: `${item.id} · ${item.vehicle}`, type: "E-way", href: "/app/eway-bills" })),
      ...employees.map((item) => ({ label: `${item.name} · ${item.department}`, type: "Employee", href: "/app/employees" })),
      ...users.map((item) => ({ label: `${item.name} · ${item.role}`, type: "User", href: "/app/users" })),
      ...reports.map((item) => ({ label: item.title, type: "Report", href: "/app/reports" })),
    ].filter((item) => `${item.label} ${item.type}`.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  useEffect(() => {
    const hasStoredTokens = Boolean(getAccessToken() || getRefreshToken());
    if (authUser || authStatus === "anonymous" || !hasStoredTokens) {
      if (!hasStoredTokens && authStatus === "idle") {
        dispatch(setAuthStatus("anonymous"));
      }
      return;
    }

    let active = true;
    fetchAuthProfile()
      .then((user) => {
        if (active) {
          dispatch(setAuthUser(user));
        }
      })
      .catch(() => {
        if (active) {
          clearAuthTokens();
          dispatch(clearAuthUser());
          toast({
            tone: "error",
            title: "Session expired",
            description: "Please sign in again to continue.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [authStatus, authUser, dispatch]);

  useEffect(() => {
    if (
      authStatus !== "authenticated" ||
      !hasAuthTokens ||
      companiesLoading ||
      companiesError ||
      usingCompanyFallback ||
      registeredCompanies.length > 0
    ) {
      return;
    }

    if (!companyGateToastShown.current) {
      companyGateToastShown.current = true;
      toast({
        tone: "info",
        title: "Create your company first",
        description: "Add a company workspace before using invoices, inventory, reports, and AI tools.",
      });
    }
    router.replace("/onboarding/company");
  }, [
    authStatus,
    companiesError,
    companiesLoading,
    hasAuthTokens,
    registeredCompanies.length,
    router,
    usingCompanyFallback,
  ]);

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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !isTypingField) {
        event.preventDefault();
        document.getElementById("global-app-search")?.focus();
      }
      if (event.key === "Escape") {
        setSearch("");
        setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSignOut() {
    try {
      await logoutAuthUser();
      toast({
        tone: "success",
        title: "Signed out",
        description: "Your KoshPilot session has ended.",
      });
    } catch {
      toast({
        tone: "success",
        title: "Signed out",
        description: "Local session cleared.",
      });
    } finally {
      dispatch(clearAuthUser());
      router.replace("/login");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 animate-fade-up overflow-y-auto border-r bg-card p-4 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl bg-primary/10 p-3 text-primary">
          <BrandMark />
          <div>
            <p className="font-bold text-foreground">KoshPilot</p>
            <p className="text-xs text-muted-foreground">{t("invoiceOs")}</p>
          </div>
        </Link>
        <div className="mb-5 rounded-3xl border bg-background p-3">
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Current company</p>
          <CompanySwitcher compact />
        </div>
        <nav className="space-y-2">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item.href);
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
                <span className="min-w-0 flex-1 truncate">{navLabel(item, t)}</span>
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
          {navSections.map((section) => {
            const SectionIcon = section.icon;
            const hasActiveItem = section.items.some((item) => isNavActive(pathname, item.href));
            const open = openSections[section.id] || hasActiveItem;
            return (
              <div key={section.id} className="rounded-2xl">
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    hasActiveItem && "bg-muted text-foreground",
                  )}
                  onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !open }))}
                  aria-expanded={open}
                >
                  <SectionIcon className="nav-icon" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-left">{section.label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
                </button>
                {open ? (
                  <div className="ml-4 mt-1 space-y-1 border-l pl-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isNavActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                            active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate">{navLabel(item, t)}</span>
                          <kbd className={cn("rounded-md border px-1.5 py-0.5 text-[9px] font-black", active && "border-primary-foreground/25")}>Alt {item.shortcut}</kbd>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="flex h-20 items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <Button variant="ghost" className="h-11 w-11 p-0 lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden max-w-2xl flex-1 items-center gap-3 rounded-2xl border bg-card px-3 lg:flex">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input id="global-app-search" value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder={t("searchPlaceholder")} />
              {searchResults.length ? (
                <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border bg-card p-2 shadow-2xl">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.label}`}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        router.push(result.href);
                        setSearch("");
                      }}
                    >
                      <span className="font-semibold">{result.label}</span>
                      <span className="text-xs text-muted-foreground">{result.type}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Button variant="secondary" className="px-3 sm:px-4" onClick={() => dispatch(setAiOpen(true))}>
              <Bot className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{t("aiCopilot")}</span>
            </Button>
            <div className="hidden sm:block">
              <GstCalculator />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-sm font-bold outline-none ring-ring transition hover:bg-muted/80 focus:ring-2">
                  {profileInitials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <span className="block text-sm text-foreground">{authUser?.name || "KoshPilot user"}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{authUser?.email || "Sign in to sync profile"}</span>
                  <span className="mt-1 block text-xs font-normal">{activeCompany.role} · {activeCompany.name}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Workspace tools</DropdownMenuLabel>
                <div className="grid gap-2 px-2 py-1">
                  <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI credits
                    </span>
                    <span className="text-muted-foreground">{remaining} left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Button variant="ghost" className="h-11 w-11 p-0" aria-label="Notifications">
                      <Bell className="h-5 w-5 shrink-0" aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="sm:hidden">
                    <GstCalculator />
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/app/settings")}>{t("profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/app/settings")}>{t("companySettings")}</DropdownMenuItem>
                <DropdownMenuItem>{t("keyboardShortcuts")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>{t("signOut")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="animate-fade-up p-4 sm:p-6">{children}</main>
      </div>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[130] bg-background/70 backdrop-blur lg:hidden">
          <aside className="h-full w-[min(86vw,340px)] animate-fade-up overflow-y-auto border-r bg-card p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 text-primary" onClick={() => setMobileNavOpen(false)}>
                <BrandMark />
                <span className="font-bold text-foreground">KoshPilot</span>
              </Link>
              <Button variant="ghost" className="h-10 w-10 p-0" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-5 rounded-3xl border bg-background p-3">
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Current company</p>
              <CompanySwitcher compact />
            </div>
            <div className="mb-5 flex items-center gap-3 rounded-3xl border bg-background p-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <nav className="space-y-2">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="nav-icon" />
                    {navLabel(item, t)}
                  </Link>
                );
              })}
              {navSections.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <div key={section.id} className="rounded-2xl">
                    <p className="mt-4 flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
                      <SectionIcon className="h-4 w-4" />
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileNavOpen(false)}
                            className="ml-4 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Icon className="h-4 w-4" />
                            {navLabel(item, t)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
      <AiCopilot />
    </div>
  );
}
