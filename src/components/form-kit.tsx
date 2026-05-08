"use client";

import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Calendar } from "@/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "./toast";

type Option = string | { label: string; value: string };
type FormErrors = Record<string, string>;
type FormValidationContextValue = {
  errors: FormErrors;
  clearError: (name: string) => void;
};

const FormValidationContext = createContext<FormValidationContextValue | null>(
  null,
);

function optionValue(option: Option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option: Option) {
  return typeof option === "string" ? option : option.label;
}

function fieldName(label: string, provided?: string) {
  return (
    provided ||
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

function parseDateInput(value?: string | readonly string[] | number) {
  if (!value || Array.isArray(value)) return undefined;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatDateInput(date?: Date) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

function validateControl(
  control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  const label = control.dataset.label || control.name || "This field";
  const value = control.value.trim();
  const required = control.dataset.required === "true";
  const minLength = Number(control.getAttribute("minlength") || 0);
  const maxLength = Number(control.getAttribute("maxlength") || 0);
  const pattern = control.getAttribute("pattern");
  const min = control.getAttribute("min");
  const max = control.getAttribute("max");

  if (required && !value) {
    return `${label} is required.`;
  }

  if (!value) {
    return "";
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "email" &&
    control.validity.typeMismatch
  ) {
    return `Enter a valid email address for ${label}.`;
  }

  if (control instanceof HTMLInputElement && control.type === "tel") {
    const digits = value.replace(/\D/g, "");
    const isIndianPhone =
      digits.length === 10 ||
      (digits.length === 12 && digits.startsWith("91")) ||
      (digits.length === 11 && digits.startsWith("0"));
    if (isIndianPhone) {
      return "";
    }
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "tel" &&
    pattern &&
    !new RegExp(pattern).test(value)
  ) {
    return `Enter a valid Indian phone number for ${label}.`;
  }

  if (minLength && value.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  if (maxLength && value.length > maxLength) {
    return `${label} must be ${maxLength} characters or fewer.`;
  }

  if (pattern && !new RegExp(pattern).test(value)) {
    return control.dataset.patternMessage || `${label} format is invalid.`;
  }

  if (control instanceof HTMLInputElement && control.type === "number") {
    const numeric = Number(value);
    if (min !== null && numeric < Number(min)) {
      return `${label} must be at least ${min}.`;
    }
    if (max !== null && numeric > Number(max)) {
      return `${label} must be ${max} or less.`;
    }
  }

  return "";
}

export function FormCard({
  title,
  description,
  children,
  action,
  asForm = false,
  className,
  onValidSubmit,
  successMessage,
  showSuccessToast = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  asForm?: boolean;
  className?: string;
  onValidSubmit?: (values: Record<string, string>) => void;
  successMessage?: string;
  showSuccessToast?: boolean;
}) {
  const [errors, setErrors] = useState<FormErrors>({});
  const validationContext = useMemo(
    () => ({
      errors,
      clearError: (name: string) =>
        setErrors((current) => {
          if (!current[name]) return current;
          const next = { ...current };
          delete next[name];
          return next;
        }),
    }),
    [errors],
  );

  const content = (
    <FormValidationContext.Provider value={validationContext}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {/* {Object.keys(errors).length ? (
        <div className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {Object.entries(errors).map(([name, message]) => (
              <li key={name}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null} */}
      {children}
    </FormValidationContext.Provider>
  );

  if (asForm) {
    return (
      <form
        noValidate
        className={cn(
          "animate-fade-up rounded-2xl border bg-card p-5 text-card-foreground shadow-soft",
          "min-w-0",
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault();
          const controls = Array.from(
            event.currentTarget.querySelectorAll<
              HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >("input, select, textarea"),
          );
          const nextErrors: FormErrors = {};
          for (const control of controls) {
            if (!control.name) continue;
            const message = validateControl(control);
            control.dataset.invalid = message ? "true" : "false";
            control.setAttribute("aria-invalid", message ? "true" : "false");
            if (message) nextErrors[control.name] = message;
          }
          setErrors(nextErrors);
          if (!Object.keys(nextErrors).length) {
            event.currentTarget.dataset.submitted = "true";
            const values = Object.fromEntries(controls.map((control) => [control.name, control.value]));
            onValidSubmit?.(values);
            if (showSuccessToast) {
              toast({
                tone: "success",
                title: successMessage ?? `${title} saved`,
                description: "Validated successfully and stored in this demo session.",
              });
            }
          } else {
            const firstInvalid = event.currentTarget.querySelector<HTMLElement>(
              "[data-invalid='true']",
            );
            firstInvalid?.focus();
          }
        }}
      >
        {content}
      </form>
    );
  }

  return <Card className={cn("p-5", className)}>{content}</Card>;
}

export function CloseFormButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-9 w-9 rounded-xl p-0"
      onClick={onClick}
      aria-label="Close form"
      title="Close form"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

export function SlideFormPanel({
  open,
  children,
  className,
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    const timeout = window.setTimeout(() => setMounted(false), 240);
    return () => window.clearTimeout(timeout);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("form-slide-panel", className)}
    >
      {children}
    </div>
  );
}

export function FormModal({
  open,
  onOpenChange,
  title = "Form",
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [resetKey, setResetKey] = useState(0);

  const close = useCallback(() => {
    setResetKey((current) => current + 1);
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [close, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed left-0 top-0 z-[140] flex h-dvh w-dvw items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        className="fixed inset-0 bg-black/65 backdrop-blur-sm"
        aria-label="Close form modal"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-transparent text-card-foreground shadow-2xl animate-fade-up",
          className,
        )}
      >
        <div key={resetKey}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function FormGrid({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TextField({
  label,
  helper,
  required,
  name,
  onInput,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
}) {
  const context = useContext(FormValidationContext);
  const resolvedName = fieldName(label, name);
  const error = context?.errors[resolvedName];
  return (
    <Field
      label={label}
      helper={helper}
      required={required}
      error={error}
    >
      <Input
        {...props}
        name={resolvedName}
        data-label={label}
        data-required={required ? "true" : "false"}
        data-invalid={error ? "true" : "false"}
        aria-invalid={error ? "true" : "false"}
        onInput={(event) => {
          context?.clearError(resolvedName);
          event.currentTarget.dataset.invalid = "false";
          onInput?.(event);
        }}
      />
    </Field>
  );
}

export function DatePickerField({
  label,
  helper,
  required,
  name,
  defaultValue,
  value,
  min,
  max,
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
}) {
  const context = useContext(FormValidationContext);
  const resolvedName = fieldName(label, name);
  const error = context?.errors[resolvedName];
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseDateInput(value ?? defaultValue),
  );
  const selectedValue = formatDateInput(selectedDate);
  const minDate = parseDateInput(min);
  const maxDate = parseDateInput(max);

  return (
    <Field
      label={label}
      helper={helper}
      required={required}
      error={error}
    >
      <input
        type="hidden"
        name={resolvedName}
        value={selectedValue}
        data-label={label}
        data-required={required ? "true" : "false"}
        data-invalid={error ? "true" : "false"}
        aria-invalid={error ? "true" : "false"}
        min={min}
        max={max}
        readOnly
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className={cn(
              "h-11 w-full justify-between rounded-xl border bg-background px-3 font-normal",
              !selectedDate && "text-muted-foreground",
              error &&
                "border-destructive text-destructive ring-2 ring-destructive",
            )}
          >
            <span>
              {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
            </span>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              context?.clearError(resolvedName);
              setOpen(false);
            }}
            disabled={(date) =>
              Boolean((minDate && date < minDate) || (maxDate && date > maxDate))
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export function SelectField({
  label,
  helper,
  options,
  required,
  name,
  onChange,
  defaultValue,
  value,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  helper?: string;
  options: Option[];
  placeholder?: string;
}) {
  const context = useContext(FormValidationContext);
  const resolvedName = fieldName(label, name);
  const error = context?.errors[resolvedName];
  const initialValue = String(value ?? defaultValue ?? "");
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const selectedLabel = selectedValue
    ? optionLabel(options.find((option) => optionValue(option) === selectedValue) ?? selectedValue)
    : "";
  return (
    <Field
      label={label}
      helper={helper}
      required={required}
      error={error}
    >
      <input
        type="hidden"
        name={resolvedName}
        value={selectedValue}
        data-label={label}
        data-required={required ? "true" : "false"}
        data-invalid={error ? "true" : "false"}
        aria-invalid={error ? "true" : "false"}
        readOnly
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className={cn(
              "h-11 w-full justify-between rounded-xl border bg-background px-3 font-normal",
              error && "border-destructive text-destructive ring-2 ring-destructive",
              props.className,
            )}
          >
            <span
              className={cn(
                "min-w-0 truncate text-left",
                selectedValue ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {selectedLabel || placeholder || `Select ${label.toLowerCase()}`}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{selectedValue ? "Change" : "Select"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width]"
        >
          {options.map((option) => {
            const nextValue = optionValue(option);
            return (
              <DropdownMenuItem
                key={nextValue}
                onClick={() => {
                  setSelectedValue(nextValue);
                  context?.clearError(resolvedName);
                  onChange?.({
                    target: { name: resolvedName, value: nextValue },
                    currentTarget: { name: resolvedName, value: nextValue },
                  } as React.ChangeEvent<HTMLSelectElement>);
                }}
              >
                {optionLabel(option)}
                {selectedValue === nextValue ? (
                  <span className="ml-auto text-xs text-primary">Selected</span>
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Field>
  );
}

export function TextareaField({
  label,
  helper,
  required,
  name,
  onInput,
  fieldClassName,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helper?: string;
  fieldClassName?: string;
}) {
  const context = useContext(FormValidationContext);
  const resolvedName = fieldName(label, name);
  const error = context?.errors[resolvedName];
  return (
    <Field
      label={label}
      helper={helper}
      required={required}
      error={error}
      className={fieldClassName}
    >
      <Textarea
        {...props}
        name={resolvedName}
        data-label={label}
        data-required={required ? "true" : "false"}
        data-invalid={error ? "true" : "false"}
        aria-invalid={error ? "true" : "false"}
        onInput={(event) => {
          context?.clearError(resolvedName);
          event.currentTarget.dataset.invalid = "false";
          onInput?.(event);
        }}
      />
    </Field>
  );
}

export function CheckboxCard({
  label,
  description,
  defaultChecked,
  name,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  name?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border bg-background p-3 text-sm transition hover:border-primary/50 hover:bg-primary/5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-lg border border-border bg-card text-transparent shadow-sm transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path d="M3.5 8.2 6.4 11 12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function FormActions({
  primary = "Save",
  secondary = "Cancel",
  extra,
}: {
  primary?: string;
  secondary?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <Button type="submit">{primary}</Button>
      <Button variant="secondary">{secondary}</Button>
      {extra}
    </div>
  );
}

export function FormSubmitRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-5 flex flex-wrap items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}

export function FilterBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className="p-5">
      <div className={cn("grid gap-3 lg:grid-cols-4", className)}>
        {children}
      </div>
    </Card>
  );
}
