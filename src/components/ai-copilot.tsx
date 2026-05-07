"use client";

import { useMemo, useState } from "react";
import { Bot, Copy, Sparkles, X } from "lucide-react";
import { consumeAiCredits, setAiOpen } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button, Card, Textarea, Badge } from "./ui";
import { CreditProgress } from "./credit-system";
import { invoices, inventory, expenses } from "@/lib/data";
import { currency } from "@/lib/utils";
import { toast } from "./toast";

function responseFor(prompt: string) {
  const lower = prompt.toLowerCase();
  const overdue = invoices.filter((invoice) => invoice.status === "Overdue");
  const receivables = invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const lowStock = inventory.filter((item) => item.stock <= item.reorder);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (lower.includes("invoice") || lower.includes("bill") || lower.includes("draft")) {
    return {
      title: "Generated invoice draft",
      body: "Draft invoice for Kavya Textiles: 20 Cotton roll A-12 and 12 Denim bundle blue with 18% GST, Net 7 terms, and payment reminder on the due date.",
      actions: ["Review line items", "Add transport charge", "Save as draft"],
    };
  }

  if (lower.includes("sales") || lower.includes("summary") || lower.includes("report")) {
    return {
      title: "Business summary",
      body: `Open receivables are ${currency(receivables)} across ${invoices.filter((invoice) => invoice.status !== "Paid").length} invoices. Expense bookings total ${currency(expenseTotal)} in the sample period. Prioritize overdue collections before new purchase commitments.`,
      actions: ["Open reports", "Export summary", "Create collection task"],
    };
  }

  if (lower.includes("stock") || lower.includes("inventory") || lower.includes("reorder")) {
    return {
      title: "Stock risk check",
      body: `${lowStock.length} items need attention: ${lowStock.map((item) => `${item.name} (${item.stock}/${item.reorder})`).join(", ")}. Raise purchase orders before weekend demand.`,
      actions: ["Create PO", "Notify inventory manager", "Open inventory"],
    };
  }

  if (lower.includes("overdue") || lower.includes("receivable") || lower.includes("collect")) {
    return {
      title: "Collection action",
      body: `${overdue.length} invoice is overdue now. Send a WhatsApp reminder to Kavya Textiles for ${currency(overdue[0]?.amount ?? 0)} and schedule a follow-up call today.`,
      actions: ["Draft reminder", "Log follow-up", "Open invoices"],
    };
  }

  return {
    title: "Suggested next action",
    body: "I can help with invoice drafting, sales summaries, receivable collection, stock risks, reports, and GST workflow checks. Try asking for one of those business tasks.",
    actions: ["Draft invoice", "Summarize sales", "Find stock risks"],
  };
}

export function AiCopilot() {
  const open = useAppSelector((state) => state.ui.aiOpen);
  const used = useAppSelector((state) => state.ui.aiCreditsUsed);
  const limit = useAppSelector((state) => state.ui.aiCreditLimit);
  const dispatch = useAppDispatch();
  const remaining = Math.max(0, limit - used);
  const percent = Math.min(100, Math.round((used / limit) * 100));
  const requestCost = 8;
  const blocked = remaining < requestCost;
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("stock risks");
  const answer = useMemo(() => responseFor(submittedPrompt), [submittedPrompt]);

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
          {percent >= 100 || blocked ? (
            <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              AI credit limit reached. Top up credits or upgrade your plan to continue.
            </div>
          ) : percent >= 80 ? (
            <div className="mt-4 rounded-2xl border border-secondary/40 bg-secondary/10 p-3 text-sm text-secondary-foreground">
              AI usage is above 80%. Consider a top-up before the wallet reaches zero.
            </div>
          ) : null}
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
            <p className="text-sm text-muted-foreground">{answer.body}</p>
            <div className="mt-4 flex gap-2">
              <Button className="h-9" onClick={() => toast({ tone: "success", title: "Action queued", description: answer.actions[0] })}>Apply</Button>
              <Button variant="secondary" className="h-9">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-semibold">{answer.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {answer.actions.map((action) => <Badge key={action} tone="green">{action}</Badge>)}
            </div>
          </Card>
        </div>
        <div className="border-t p-5">
          <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about invoices, stock, reports, customers, or users..." />
          <Button
            className="mt-3 w-full"
            onClick={() => {
              if (!prompt.trim()) {
                toast({ tone: "error", title: "Prompt required", description: "Type a business question before generating an AI response." });
                return;
              }
              if (blocked) {
                toast({ tone: "error", title: "AI credit limit reached", description: "Top up credits or upgrade your plan to continue AI actions." });
                return;
              }
              setSubmittedPrompt(prompt);
              dispatch(consumeAiCredits(requestCost));
              toast({ tone: percent >= 80 ? "info" : "success", title: "AI response generated", description: `${requestCost} credits used from the shared wallet.` });
            }}
            disabled={blocked}
          >
            {blocked ? "Top up or upgrade to continue" : "Generate response"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
