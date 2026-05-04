"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Calculator, Divide, IndianRupee, Minus, Percent, Plus, X } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { currency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

const GST_RATES = [
  { rate: 0, shortcut: "F1" },
  { rate: 3, shortcut: "F2" },
  { rate: 5, shortcut: "F3" },
  { rate: 12, shortcut: "F4" },
  { rate: 18, shortcut: "F5" },
  { rate: 28, shortcut: "F6" },
] as const;
type GstMode = "add" | "remove";
type Operator = "+" | "-" | "*" | "/";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function formatDisplay(value: number) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = roundMoney(value);
  return String(rounded).replace(/\.00$/, "");
}

function calculate(left: number, right: number, operator: Operator | null) {
  if (!operator) return right;
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "*") return left * right;
  if (operator === "/") return right === 0 ? Number.NaN : left / right;
  return right;
}

function GstKey({
  children,
  className,
  onClick,
  title,
}: {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-12 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900 text-base font-black text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 dark:border-slate-700 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function GstCalculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<GstMode>("add");

  const numericAmount = Number(display || 0);

  const result = useMemo(() => {
    const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
    if (mode === "add") {
      const gst = roundMoney((safeAmount * rate) / 100);
      const total = roundMoney(safeAmount + gst);
      return { taxable: safeAmount, gst, total };
    }
    const taxable = rate ? roundMoney(safeAmount / (1 + rate / 100)) : safeAmount;
    const gst = roundMoney(safeAmount - taxable);
    return { taxable, gst, total: safeAmount };
  }, [mode, numericAmount, rate]);

  const halfGst = roundMoney(result.gst / 2);

  function inputDigit(digit: string) {
    setDisplay((current) => {
      if (waitingForOperand || current === "Error") {
        setWaitingForOperand(false);
        return digit === "00" ? "0" : digit;
      }
      if (current === "0") return digit === "00" ? "0" : digit;
      return `${current}${digit}`;
    });
  }

  function inputDecimal() {
    setDisplay((current) => {
      if (waitingForOperand || current === "Error") {
        setWaitingForOperand(false);
        return "0.";
      }
      return current.includes(".") ? current : `${current}.`;
    });
  }

  function clear() {
    setDisplay("0");
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
  }

  function backspace() {
    setDisplay((current) => {
      if (waitingForOperand || current === "Error" || current.length <= 1) return "0";
      return current.slice(0, -1);
    });
  }

  function applyOperator(operator: Operator) {
    const inputValue = Number(display);
    if (!Number.isFinite(inputValue)) {
      clear();
      return;
    }

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (pendingOperator) {
      const computed = calculate(storedValue, inputValue, pendingOperator);
      setDisplay(formatDisplay(computed));
      setStoredValue(computed);
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
  }

  function equals() {
    if (storedValue === null || !pendingOperator) return;
    const computed = calculate(storedValue, Number(display), pendingOperator);
    setDisplay(formatDisplay(computed));
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
  }

  function applyGst(nextMode: GstMode) {
    setMode(nextMode);
    const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
    const nextValue =
      nextMode === "add"
        ? safeAmount + (safeAmount * rate) / 100
        : rate
          ? safeAmount / (1 + rate / 100)
          : safeAmount;
    setDisplay(formatDisplay(nextValue));
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTypingField) return;

      const key = event.key.toLowerCase();

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        inputDigit(event.key);
        return;
      }

      if (event.key === ".") {
        event.preventDefault();
        inputDecimal();
        return;
      }

      if (event.ctrlKey && event.key === "+") {
        event.preventDefault();
        applyGst("add");
        return;
      }

      if (event.ctrlKey && event.key === "-") {
        event.preventDefault();
        applyGst("remove");
        return;
      }

      if (event.key === "+") {
        event.preventDefault();
        applyOperator("+");
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        applyOperator("-");
        return;
      }

      if (event.key === "*" || key === "x") {
        event.preventDefault();
        applyOperator("*");
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        applyOperator("/");
        return;
      }

      if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        equals();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }

      if (event.key === "Delete" || key === "c") {
        event.preventDefault();
        clear();
        return;
      }

      if (key === "a") {
        event.preventDefault();
        applyGst("add");
        return;
      }

      if (key === "r") {
        event.preventDefault();
        applyGst("remove");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        clear();
        return;
      }

      const shortcutRate = GST_RATES.find((preset) => preset.shortcut.toLowerCase() === key);
      if (shortcutRate) {
        event.preventDefault();
        setRate(shortcutRate.rate);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-11 min-w-11 px-3 xl:min-w-[132px] xl:justify-start">
          <Calculator className="h-4 w-4" />
          <span className="hidden xl:inline">GST Calc</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(92vw,440px)] p-4"
        data-gst-calculator-panel="true"
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          clear();
        }}
      >
        <DropdownMenuLabel>
          <span className="block text-base text-foreground">GST calculator</span>
          <span className="block text-xs font-normal text-muted-foreground">
            Desk calculator with built-in Indian GST add and remove keys.
          </span>
        </DropdownMenuLabel>

        <div className="mt-3 rounded-[1.75rem] border border-slate-700 bg-slate-950 p-3 text-white shadow-2xl">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs font-black tracking-wider">KOSHPILOT</span>
            <span className="rounded-md bg-amber-200 px-8 py-2 shadow-inner" aria-hidden="true" />
          </div>

          <div className="rounded-2xl border border-slate-700 bg-[#cfd8d0] p-3 text-right shadow-inner">
            <div className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wide text-slate-700">
              <span>{pendingOperator ? `OP ${pendingOperator}` : mode === "add" ? "GST ADD" : "GST REMOVE"}</span>
              <span>{rate}% GST</span>
            </div>
            <div className="min-h-12 break-all font-mono text-4xl font-black tabular-nums text-slate-950">
              {display}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-6 gap-2">
            {GST_RATES.map(({ rate: gstRate, shortcut }) => (
              <button
                type="button"
                key={gstRate}
                onClick={() => setRate(gstRate)}
                className={`h-9 rounded-lg border text-xs font-black transition ${
                  rate === gstRate
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span className="block leading-none">{gstRate}%</span>
                <span className="mt-0.5 block text-[9px] leading-none opacity-70">{shortcut}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <GstKey className="bg-emerald-600 hover:bg-emerald-500" onClick={() => applyGst("add")} title="Add selected GST rate with Ctrl + Plus">
              <span className="grid leading-none">
                <span>GST+</span>
                <span className="text-[9px] opacity-75">Ctrl +</span>
              </span>
            </GstKey>
            <GstKey className="bg-cyan-700 hover:bg-cyan-600" onClick={() => applyGst("remove")} title="Remove selected GST rate with Ctrl + Minus">
              <span className="grid leading-none">
                <span>GST-</span>
                <span className="text-[9px] opacity-75">Ctrl -</span>
              </span>
            </GstKey>
            <GstKey className="bg-amber-500 text-slate-50 hover:bg-amber-400" onClick={backspace} title="Remove last digit with Backspace">
              DEL
            </GstKey>
            <GstKey className="bg-lime-500 text-slate-50 hover:bg-lime-400" onClick={clear} title="Reset calculator with Escape">
              AC
            </GstKey>

            <GstKey onClick={() => inputDigit("7")}>7</GstKey>
            <GstKey onClick={() => inputDigit("8")}>8</GstKey>
            <GstKey onClick={() => inputDigit("9")}>9</GstKey>
            <GstKey className="bg-slate-800" onClick={() => applyOperator("/")}>
              <Divide className="h-4 w-4" />
            </GstKey>

            <GstKey onClick={() => inputDigit("4")}>4</GstKey>
            <GstKey onClick={() => inputDigit("5")}>5</GstKey>
            <GstKey onClick={() => inputDigit("6")}>6</GstKey>
            <GstKey className="bg-slate-800" onClick={() => applyOperator("*")}>
              <X className="h-4 w-4" />
            </GstKey>

            <GstKey onClick={() => inputDigit("1")}>1</GstKey>
            <GstKey onClick={() => inputDigit("2")}>2</GstKey>
            <GstKey onClick={() => inputDigit("3")}>3</GstKey>
            <GstKey className="bg-slate-800" onClick={() => applyOperator("-")}>
              <Minus className="h-4 w-4" />
            </GstKey>

            <GstKey onClick={() => inputDigit("0")}>0</GstKey>
            <GstKey onClick={() => inputDigit("00")}>00</GstKey>
            <GstKey onClick={inputDecimal}>.</GstKey>
            <GstKey className="bg-slate-800" onClick={() => applyOperator("+")}>
              <Plus className="h-4 w-4" />
            </GstKey>

            <GstKey className="col-span-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={equals}>
              =
            </GstKey>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-2xl border bg-background p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold">
              <IndianRupee className="h-4 w-4 text-primary" />
              GST working
            </div>
            <Badge tone={mode === "add" ? "green" : "blue"}>
              {mode === "add" ? "Added" : "Removed"} {rate}%
            </Badge>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Taxable amount</span>
              <span className="font-bold">{currency(result.taxable)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">GST amount</span>
              <span className="font-bold text-primary">{currency(result.gst)}</span>
            </div>
            <div className="grid gap-2 rounded-xl bg-muted p-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">CGST</span>
                <span className="font-semibold">{currency(halfGst)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">SGST</span>
                <span className="font-semibold">{currency(halfGst)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-t pt-3">
              <span className="font-bold">Final total</span>
              <span className="text-xl font-black">{currency(result.total)}</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
