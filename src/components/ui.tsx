import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 animate-scale-in items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring active:translate-y-0 disabled:translate-y-0 disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-soft",
        variant === "secondary" && "border bg-card text-foreground hover:bg-muted hover:shadow-sm",
        variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground",
        variant === "danger" && "bg-destructive text-destructive-foreground hover:opacity-90 hover:shadow-soft",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-fade-up min-w-0 rounded-2xl border bg-card text-card-foreground shadow-soft", className)} {...props} />;
}

export function Badge({ children, className, tone = "default" }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "green" | "amber" | "red" | "blue" | "violet" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "default" && "bg-muted text-muted-foreground",
        tone === "green" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        tone === "amber" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        tone === "red" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
        tone === "blue" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        tone === "violet" && "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({ label, children, helper, required, error, className }: { label: string; children: React.ReactNode; helper?: string; required?: boolean; error?: string; className?: string }) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="label">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : helper ? <span className="text-xs text-muted-foreground">{helper}</span> : null}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ required: _required, ...props }, ref) {
    return <input ref={ref} className={cn("field", props.className)} {...props} />;
  },
);

export function Select({ children, className, required: _required, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("field", className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ required: _required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring data-[invalid=true]:border-destructive data-[invalid=true]:text-destructive data-[invalid=true]:ring-destructive", props.className)} {...props} />;
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function TableShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("animate-fade-up max-w-full overflow-x-auto rounded-2xl border bg-card shadow-soft", className)}>{children}</div>;
}

export function EmptyState({
  title = "No records found",
  description = "Create your first record to start using this workflow.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid min-h-[320px] place-items-center rounded-2xl border bg-card p-8 text-center shadow-soft", className)}>
      <div className="max-w-lg">
        <EmptyStateIllustration />
        <h2 className="mt-5 text-2xl font-black">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

function EmptyStateIllustration() {
  return (
    <svg
      className="mx-auto h-40 w-56 max-w-full"
      viewBox="0 0 224 160"
      fill="none"
      role="img"
      aria-label="Empty workspace illustration"
    >
      <rect x="44" y="34" width="104" height="92" rx="18" className="fill-primary/10 stroke-primary/25" strokeWidth="2" />
      <rect x="62" y="52" width="68" height="10" rx="5" className="fill-primary/45" />
      <rect x="62" y="72" width="52" height="8" rx="4" className="fill-muted-foreground/20" />
      <rect x="62" y="88" width="70" height="8" rx="4" className="fill-muted-foreground/20" />
      <rect x="62" y="104" width="40" height="8" rx="4" className="fill-muted-foreground/20" />
      <circle cx="152" cy="54" r="24" className="fill-primary/20 stroke-primary/45" strokeWidth="2" />
      <path d="M142 54h20M152 44v20" className="stroke-primary" strokeWidth="5" strokeLinecap="round" />
      <path d="M31 126c20 10 49 15 86 14 30-1 55-6 76-16" className="stroke-muted-foreground/20" strokeWidth="8" strokeLinecap="round" />
      <path d="M159 102l22 9-15 14-21-9 14-14z" className="fill-amber-400/80" />
      <path d="M181 111v19l-15 14v-19l15-14z" className="fill-amber-500/90" />
      <path d="M145 116l21 9v19l-21-9v-19z" className="fill-amber-300/80" />
      <circle cx="34" cy="58" r="7" className="fill-primary/45" />
      <circle cx="186" cy="42" r="5" className="fill-amber-400" />
      <circle cx="178" cy="86" r="4" className="fill-primary/35" />
    </svg>
  );
}

export function DataTable({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty?: React.ReactNode }) {
  return (
    <TableShell>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.length ? rows.map((row, index) => (
            <tr key={index} className="animate-fade-up hover:bg-muted/40" style={{ animationDelay: `${index * 35}ms` }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                {empty ?? "No records found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableShell>
  );
}
