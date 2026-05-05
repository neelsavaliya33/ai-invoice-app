"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui";

type ToastTone = "success" | "info" | "error";
type ToastPayload = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastEventDetail = Omit<ToastPayload, "id">;

export function toast(detail: ToastEventDetail) {
  window.dispatchEvent(new CustomEvent<ToastEventDetail>("koshpilot:toast", { detail }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastEventDetail>).detail;
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, ...detail }].slice(-4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
      }, 4200);
    }

    window.addEventListener("koshpilot:toast", onToast);
    return () => window.removeEventListener("koshpilot:toast", onToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[200] grid w-[min(92vw,380px)] gap-3">
      {toasts.map((toastItem) => {
        const Icon = toastItem.tone === "success" ? CheckCircle2 : toastItem.tone === "error" ? XCircle : Info;
        return (
          <div
            key={toastItem.id}
            className="animate-scale-in rounded-2xl border bg-card p-4 text-card-foreground shadow-2xl"
            role="status"
          >
            <div className="flex gap-3">
              <Icon className={toastItem.tone === "error" ? "mt-0.5 h-5 w-5 text-destructive" : "mt-0.5 h-5 w-5 text-primary"} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{toastItem.title}</p>
                {toastItem.description ? <p className="mt-1 text-sm leading-5 text-muted-foreground">{toastItem.description}</p> : null}
              </div>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toastItem.id))}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
