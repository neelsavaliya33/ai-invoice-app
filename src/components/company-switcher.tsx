"use client";

import { Building2, Check, ChevronsUpDown, MapPin, Plus, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { companies } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveCompany } from "@/store/store";
import { toast } from "./toast";
import { fetchUserCompanies, getAccessToken, getRefreshToken, type CompanyResource } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function useActiveCompany() {
  const activeCompanyId = useAppSelector((state) => state.ui.activeCompanyId);
  const { data } = useRegisteredCompanies();
  return data.find((company) => company.id === activeCompanyId) ?? data[0] ?? companies[0];
}

export function useRegisteredCompanies() {
  const hasAuthTokens = typeof window !== "undefined" && Boolean(getAccessToken() || getRefreshToken());
  const query = useQuery({
    queryKey: ["user-companies"],
    queryFn: fetchUserCompanies,
    enabled: hasAuthTokens,
    staleTime: 5 * 60 * 1000,
  });
  const apiCompanies = Array.isArray(query.data) ? query.data : [];
  const isUsingFallback = !hasAuthTokens || query.isError;
  const data: CompanyResource[] = isUsingFallback ? [...companies] : apiCompanies;
  return { ...query, data, hasAuthTokens, isUsingFallback };
}

export function CompanyAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-foreground shadow-soft",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function CompanySwitcher({ compact = false }: { compact?: boolean }) {
  const activeCompany = useActiveCompany();
  const { data: registeredCompanies, isError, isLoading, isUsingFallback } = useRegisteredCompanies();
  const dispatch = useAppDispatch();
  const router = useRouter();

  function changeCompany(companyId: string) {
    const nextCompany = registeredCompanies.find((company) => company.id === companyId);
    if (!nextCompany || nextCompany.id === activeCompany.id) return;

    dispatch(setActiveCompany(nextCompany.id));
    toast({
      tone: "success",
      title: "Company changed",
      description: `You are now working in ${nextCompany.name}.`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex min-w-0 items-center gap-3 rounded-2xl border bg-card p-2 text-left outline-none transition hover:bg-muted focus:ring-2 focus:ring-ring",
            compact ? "w-full" : "hidden w-[270px] lg:flex",
          )}
          aria-label="Change active company"
        >
          <CompanyAvatar initials={activeCompany.initials} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-black text-foreground">{activeCompany.name}</span>
            <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {activeCompany.city} · {activeCompany.financialYear}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(92vw,420px)] p-2">
        <DropdownMenuLabel>
          <span className="block text-xs uppercase tracking-wide">Switch company</span>
          <span className="mt-1 block text-sm font-normal text-slate-700 dark:text-slate-300">
            One login can manage multiple GST registrations and books.
          </span>
          {isError && isUsingFallback ? (
            <span className="mt-1 block text-xs font-normal text-amber-700 dark:text-amber-300">
              Could not load backend companies, showing saved demo workspaces.
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid gap-1">
          {!isUsingFallback && isLoading ? (
            <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              Loading your companies...
            </div>
          ) : null}
          {!isUsingFallback && !isLoading && !registeredCompanies.length ? (
            <div className="rounded-2xl border bg-muted/40 p-4">
              <p className="text-sm font-bold text-foreground">No company registered yet</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Add your first company to create invoices, inventory, reports, and GST records in this workspace.
              </p>
            </div>
          ) : null}
          {registeredCompanies.map((company) => (
            <DropdownMenuItem
              key={company.id}
              onSelect={() => changeCompany(company.id)}
              className={cn(
                "items-start gap-3 rounded-2xl py-3",
                company.id === activeCompany.id && "bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/10",
              )}
            >
              <CompanyAvatar initials={company.initials} className="h-11 w-11 rounded-xl text-xs" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate font-bold">{company.name}</span>
                  {company.id === activeCompany.id ? <Check className="h-4 w-4 text-primary" /> : null}
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {company.industry} · {company.gstin}
                </span>
                <span className="mt-2 grid gap-2 text-[11px] font-semibold text-muted-foreground sm:grid-cols-3">
                  <span className="rounded-lg bg-muted px-2 py-1">Sales ₹{Math.round(company.salesThisMonth / 1000)}k</span>
                  <span className="rounded-lg bg-muted px-2 py-1">Due ₹{Math.round(company.receivables / 1000)}k</span>
                  <span className="rounded-lg bg-muted px-2 py-1">{company.role}</span>
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-2xl" onSelect={() => router.push("/onboarding/company")}>
          <Plus className="h-4 w-4" />
          {registeredCompanies.length ? "Add another company" : "Add first company"}
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-2xl" onSelect={() => router.push("/app/users")}>
          <Settings className="h-4 w-4" />
          Manage company access
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CompanyWorkspaceCard() {
  const activeCompany = useActiveCompany();
  const stats = [
    ["GSTIN", activeCompany.gstin],
    ["Industry", activeCompany.industry],
    ["Location", `${activeCompany.city}, ${activeCompany.state}`],
    ["Role", activeCompany.role],
  ];

  return (
    <section className="animate-fade-up rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <CompanyAvatar initials={activeCompany.initials} className="h-14 w-14 rounded-2xl text-base" />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Active company workspace</p>
            <h2 className="truncate text-2xl font-black">{activeCompany.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activeCompany.legalName}</p>
          </div>
        </div>
        <div className="w-full sm:max-w-md xl:max-w-xl">
          <CompanySwitcher compact />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-background p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
            <p className="mt-1 truncate font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-primary/10 p-4 text-primary">
          <p className="text-xs font-bold uppercase">Sales this month</p>
          <p className="mt-1 text-xl font-black">₹{activeCompany.salesThisMonth.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-2xl bg-amber-100 p-4 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <p className="text-xs font-bold uppercase">Receivables</p>
          <p className="mt-1 text-xl font-black">₹{activeCompany.receivables.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <p className="text-xs font-bold uppercase">Stock value</p>
          <p className="mt-1 text-xl font-black">₹{activeCompany.stockValue.toLocaleString("en-IN")}</p>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4 text-primary" />
        Switching company changes the active workspace for invoices, inventory, reports, GST, payroll, and AI usage.
      </p>
    </section>
  );
}
