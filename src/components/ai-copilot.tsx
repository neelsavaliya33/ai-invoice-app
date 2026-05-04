"use client";

import { Bot, Copy, Sparkles, X } from "lucide-react";
import { consumeAiCredits, setAiOpen } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Card, Textarea, Badge } from "./ui";
import { CreditProgress } from "./credit-system";

export function AiCopilot() {
  const open = useAppSelector((state) => state.ui.aiOpen);
  const used = useAppSelector((state) => state.ui.aiCreditsUsed);
  const limit = useAppSelector((state) => state.ui.aiCreditLimit);
  const dispatch = useAppDispatch();
  const remaining = Math.max(0, limit - used);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-md animate-scale-in flex-col border-l bg-card shadow-soft">
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent/15 p-2 text-accent">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold">AI Copilot</h2>
              <p className="text-xs text-muted-foreground">Deterministic demo assistant</p>
            </div>
          </div>
          <Button variant="ghost" className="h-9 w-9 p-0" onClick={() => dispatch(setAiOpen(false))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="border-b p-5">
          <CreditProgress compact />
        </div>
        <div className="flex-1 space-y-4 overflow-auto p-5">
          <div className="flex flex-wrap gap-2">
            {["Draft invoice", "Find overdue", "Stock risks", "Explain report", "Summarize today"].map((prompt) => (
              <Badge key={prompt} tone="violet">{prompt}</Badge>
            ))}
          </div>
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-accent" />
              Suggested action
            </div>
            <p className="text-sm text-muted-foreground">
              Collect INR 1.74L from overdue invoices, send reminders to Kavya Textiles and Mehta Traders, and reorder cotton roll A-12 before weekend demand.
            </p>
            <div className="mt-4 flex gap-2">
              <Button className="h-9">Apply</Button>
              <Button variant="secondary" className="h-9">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-semibold">Generated invoice draft</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Kavya Textiles: 20 Cotton roll A-12, 12 Denim bundle blue, 18% GST, due in 7 days.
            </p>
          </Card>
        </div>
        <div className="border-t p-5">
          <Textarea placeholder="Ask about invoices, stock, reports, customers, or users..." />
          <Button className="mt-3 w-full" onClick={() => dispatch(consumeAiCredits(8))} disabled={remaining <= 0}>
            {remaining <= 0 ? "AI credit limit reached" : "Generate response"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
