"use client";

import { useState } from "react";
import { ewayBills } from "@/lib/data";
import {
  EwayFilters,
  EwayGenerator,
  EwayHeader,
  EwayHelpCard,
  EwayKpis,
  EwayTable,
} from "@/components/eway-workflow";
import { FormModal } from "@/components/form-kit";

export default function EwayBillsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [drafts, setDrafts] = useState<typeof ewayBills>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="space-y-6">
      <EwayHeader onActionClick={() => setIsFormOpen(true)} />
      <EwayKpis />
      <EwayFilters query={query} status={status} onQueryChange={setQuery} onStatusChange={setStatus} />
      <FormModal open={isFormOpen} onOpenChange={setIsFormOpen} title="E-way bill generation">
        <EwayGenerator
          onClose={() => setIsFormOpen(false)}
          onDraftCreated={(bill) => setDrafts((current) => [bill, ...current.filter((item) => item.id !== bill.id)])}
        />
      </FormModal>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <EwayTable query={query} status={status} extraBills={drafts} />
        <EwayHelpCard />
      </div>
    </div>
  );
}
