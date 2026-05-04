"use client";

import { UserRows } from "@/components/workflow";
import { Button, Card, SectionTitle } from "@/components/ui";
import { CheckboxCard, FormCard, FormGrid, SelectField, TextField } from "@/components/form-kit";
import { useI18n } from "@/lib/i18n";

const permissions = ["View invoices", "Create invoices", "Edit invoices", "Record payments", "View customers", "Manage stock", "Export reports", "Manage users", "View audit logs"];

export default function UsersPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <SectionTitle title={t("userManagement")} subtitle={t("userSubtitle")} action={<Button>{t("inviteUser")}</Button>} />
      <UserRows />
      <div className="grid gap-6 xl:grid-cols-2">
        <FormCard title="Invite user" description="Reusable invite form for team access workflows." asForm>
          <FormGrid>
            <TextField label="Full name" required minLength={3} placeholder="Enter name" />
            <TextField label="Email" required type="email" placeholder="name@company.com" />
            <TextField label="Phone" required type="tel" pattern="^\\+91\\s?[0-9\\s]{10,14}$" placeholder="+91 ..." />
            <SelectField label="Role" required options={["Accountant", "Sales", "Inventory Manager"]} />
            <SelectField label="Access scope" required options={["Billing, reports", "Stock only", "All access"]} />
            <TextField label="Custom message" minLength={8} placeholder="Optional invitation note" />
          </FormGrid>
          <Button type="submit" className="mt-5">Send invite</Button>
        </FormCard>
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
