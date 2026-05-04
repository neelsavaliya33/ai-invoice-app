"use client";

import {
  EwayFilters,
  EwayGenerator,
  EwayHeader,
  EwayHelpCard,
  EwayKpis,
  EwayTable,
} from "@/components/eway-workflow";

export default function EwayBillsPage() {
  return (
    <div className="space-y-6">
      <EwayHeader />
      <EwayKpis />
      <EwayFilters />
      <EwayGenerator />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <EwayTable />
        <EwayHelpCard />
      </div>
    </div>
  );
}
