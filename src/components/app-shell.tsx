"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bot, Boxes, FileText, Gauge, Search, Settings, Users, UserCog, ChartNoAxesCombined } from "lucide-react";
import { setAiOpen } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import { ThemeToggle } from "./theme-toggle";
import { AiCopilot } from "./ai-copilot";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

const nav = [
  { href: "/app", label: "Dashboard", icon: Gauge },
  { href: "/app/invoices", label: "Invoices", icon: FileText },
  { href: "/app/customers", label: "Customers", icon: Users },
  { href: "/app/inventory", label: "Inventory", icon: Boxes },
  { href: "/app/reports", label: "Reports", icon: ChartNoAxesCombined },
  { href: "/app/users", label: "User Management", icon: UserCog },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 animate-fade-up border-r bg-card p-4 lg:block">
        <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl bg-primary/10 p-3 text-primary">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold">L</div>
          <div>
            <p className="font-bold text-foreground">LedgerAI</p>
            <p className="text-xs text-muted-foreground">Invoice OS</p>
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
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
            <div className="hidden flex-1 items-center gap-3 rounded-2xl border bg-card px-3 lg:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input className="h-11 flex-1 bg-transparent text-sm outline-none" placeholder="Search invoices, customers, stock, or reports..." />
            </div>
            <Button variant="secondary" onClick={() => dispatch(setAiOpen(true))}>
              <Bot className="h-4 w-4" />
              AI Copilot
            </Button>
            <ThemeToggle />
            <Button variant="ghost" className="h-11 w-11 p-0">
              <Bell className="h-4 w-4" />
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
                  <span className="block text-xs font-normal">Owner account</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Company settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
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
