"use client";

import { useState } from "react";
import { UserRows } from "@/components/workflow";
import { Button, Card, SectionTitle } from "@/components/ui";
import { CheckboxCard, CloseFormButton, FormCard, FormGrid, SlideFormPanel, TextField } from "@/components/form-kit";
import { LookupSelectField } from "@/components/lookup-select-field";
import { useI18n } from "@/lib/i18n";
import { users } from "@/lib/data";
import { useCurrentPlan } from "@/components/credit-system";
import { toast } from "@/components/toast";

const permissions = ["View invoices", "Create invoices", "Edit invoices", "Record payments", "View customers", "Manage stock", "Export reports", "Manage users", "View audit logs"];

export default function UsersPage() {
  const { t } = useI18n();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const plan = useCurrentPlan();
  const usedSeats = users.filter((user) => user.status === "Active" || user.status === "Invited").length;
  const remainingSeats = Math.max(0, plan.userLimit - usedSeats);
  const limitReached = remainingSeats <= 0;
  return (
    <div className="space-y-6">
      <SectionTitle
        title={t("userManagement")}
        subtitle={t("userSubtitle")}
        action={
          <Button
            disabled={limitReached}
            onClick={() => {
              if (limitReached) {
                toast({ tone: "error", title: "User limit reached", description: "Add a user seat or upgrade your plan to invite more team members." });
                return;
              }
              setIsFormOpen(true);
            }}
          >
            {limitReached ? "Limit reached" : t("inviteUser")}
          </Button>
        }
      />
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">User seats</h2>
            <p className="mt-1 text-sm text-muted-foreground">Active and invited users count toward the {plan.name} plan limit.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-2xl border bg-background px-4 py-2 text-sm font-black">{usedSeats}/{plan.userLimit} used</span>
            <span className="rounded-2xl border bg-background px-4 py-2 text-sm font-black">{remainingSeats} remaining</span>
          </div>
        </div>
        {limitReached ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary">Add user seat</Button>
            <Button variant="secondary">Upgrade plan</Button>
          </div>
        ) : null}
      </Card>
      <UserRows />
      <div className={`grid gap-6 ${isFormOpen ? "xl:grid-cols-2" : ""}`}>
        <SlideFormPanel open={isFormOpen}>
          <FormCard title="Invite user" description="Add a team member with role-based access for this company workspace." action={<CloseFormButton onClick={() => setIsFormOpen(false)} />} asForm>
            <FormGrid>
              <TextField label="Full name" required minLength={3} placeholder="Enter name" />
              <TextField label="Email" required type="email" placeholder="name@company.com" />
              <TextField label="Phone" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" placeholder="+91 ..." />
              <LookupSelectField label="Role" group="user-roles" required />
              <LookupSelectField label="Access scope" group="access-scopes" required />
              <TextField label="Custom message" minLength={8} placeholder="Optional invitation note" />
            </FormGrid>
            <Button type="submit" className="mt-5">Send invite</Button>
          </FormCard>
        </SlideFormPanel>
        <Card className="p-5">
          <h2 className="text-xl font-bold">Role permissions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {permissions.map((permission) => (
              <CheckboxCard key={permission} label={permission} defaultChecked />
            ))}
          </div>
          <Button className="mt-5">Save role</Button>
        </Card>
      </div>
    </div>
  );
}
