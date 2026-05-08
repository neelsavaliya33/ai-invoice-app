 "use client";

import { JournalEntryForm } from "@/components/workflow-actions";
import { EmptyWorkflowPage } from "@/components/hisab-workflows";

export default function JournalVouchersPage() {
  return (
    <EmptyWorkflowPage title="Journal vouchers" subtitle="No journal vouchers posted yet" cta="New journal voucher">
      {(close) => <JournalEntryForm onClose={close} />}
    </EmptyWorkflowPage>
  );
}
