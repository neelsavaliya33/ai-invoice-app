"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLookupGroup } from "@/lib/api";

export type LookupSelectOption = {
  label: string;
  value: string;
};

export const fallbackLookups: Record<string, LookupSelectOption[]> = {
  "access-scopes": [
    { value: "All access", label: "All access" },
    { value: "Billing, reports", label: "Billing, reports" },
    { value: "Stock only", label: "Stock only" },
  ],
  "balance-statuses": [
    { value: "Any balance", label: "Any balance" },
    { value: "Outstanding", label: "Outstanding" },
    { value: "Clear", label: "Clear" },
  ],
  "customer-types": [
    { value: "Textile", label: "Textile" },
    { value: "Retail", label: "Retail" },
    { value: "Stationary", label: "Stationary" },
    { value: "Mobile Shop", label: "Mobile Shop" },
  ],
  departments: [
    { value: "Finance", label: "Finance" },
    { value: "Sales", label: "Sales" },
    { value: "Operations", label: "Operations" },
    { value: "Support", label: "Support" },
  ],
  "document-types": [
    { value: "Tax invoice", label: "Tax invoice" },
    { value: "Bill of supply", label: "Bill of supply" },
    { value: "Delivery challan", label: "Delivery challan" },
    { value: "Credit note", label: "Credit note" },
  ],
  "employee-statuses": [
    { value: "Active", label: "Active" },
    { value: "On leave", label: "On leave" },
    { value: "Exited", label: "Exited" },
  ],
  "employment-types": [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
  ],
  "eway-statuses": [
    { value: "Draft", label: "Draft" },
    { value: "Ready", label: "Ready" },
    { value: "Generated", label: "Generated" },
    { value: "Expired", label: "Expired" },
  ],
  "eway-sub-types": [
    { value: "Supply", label: "Supply" },
    { value: "Export", label: "Export" },
    { value: "Recipient not known", label: "Recipient not known" },
    { value: "SKD/CKD", label: "SKD/CKD" },
    { value: "Line sales", label: "Line sales" },
  ],
  "expense-categories": [
    { value: "Transport", label: "Transport" },
    { value: "Packaging", label: "Packaging" },
    { value: "Office supplies", label: "Office supplies" },
    { value: "Software", label: "Software" },
    { value: "Rent", label: "Rent" },
  ],
  "gst-rates": [
    { value: "0", label: "0%" },
    { value: "3", label: "3%" },
    { value: "5", label: "5%" },
    { value: "12", label: "12%" },
    { value: "18", label: "18%" },
    { value: "28", label: "28%" },
  ],
  "indian-states": [
    { value: "Gujarat", label: "Gujarat" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Delhi", label: "Delhi" },
  ],
  "invoice-statuses": [
    { value: "Draft", label: "Draft" },
    { value: "Sent", label: "Sent" },
    { value: "Paid", label: "Paid" },
    { value: "Overdue", label: "Overdue" },
  ],
  "item-categories": [
    { value: "Textile", label: "Textile" },
    { value: "Garment", label: "Garment" },
    { value: "Electronics", label: "Electronics" },
    { value: "Stationary", label: "Stationary" },
    { value: "Fire Safety", label: "Fire Safety" },
  ],
  "payment-methods": [
    { value: "UPI", label: "UPI" },
    { value: "Bank", label: "Bank transfer" },
    { value: "Cash", label: "Cash" },
    { value: "Cheque", label: "Cheque" },
  ],
  "payment-statuses": [
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
    { value: "Approved", label: "Approved" },
    { value: "Matched", label: "Matched" },
    { value: "Unmatched", label: "Unmatched" },
  ],
  "payment-terms": [
    { value: "Due on receipt", label: "Due on receipt" },
    { value: "Net 7", label: "Net 7" },
    { value: "Net 15", label: "Net 15" },
    { value: "Net 30", label: "Net 30" },
  ],
  "payroll-statuses": [
    { value: "Draft", label: "Draft" },
    { value: "Pending approval", label: "Pending approval" },
    { value: "Approved", label: "Approved" },
    { value: "Paid", label: "Paid" },
  ],
  "purchase-statuses": [
    { value: "Ordered", label: "Ordered" },
    { value: "Partial", label: "Partial" },
    { value: "Received", label: "Received" },
  ],
  "stock-statuses": [
    { value: "Any status", label: "Any status" },
    { value: "Low stock", label: "Low stock" },
    { value: "Reorder", label: "Reorder" },
    { value: "Healthy", label: "Healthy" },
    { value: "Slow moving", label: "Slow moving" },
  ],
  "supply-types": [
    { value: "Outward", label: "Outward" },
    { value: "Inward", label: "Inward" },
    { value: "Job work", label: "Job work" },
    { value: "Sales return", label: "Sales return" },
  ],
  "tax-types": [
    { value: "GST", label: "GST" },
    { value: "IGST", label: "IGST" },
    { value: "No tax", label: "No tax" },
  ],
  "transport-modes": [
    { value: "Road", label: "Road" },
    { value: "Rail", label: "Rail" },
    { value: "Air", label: "Air" },
    { value: "Ship", label: "Ship" },
  ],
  "user-roles": [
    { value: "Owner", label: "Owner" },
    { value: "Accountant", label: "Accountant" },
    { value: "Sales", label: "Sales" },
    { value: "Inventory Manager", label: "Inventory Manager" },
  ],
  warehouses: [
    { value: "All warehouses", label: "All warehouses" },
    { value: "Main", label: "Main" },
    { value: "Shop", label: "Shop" },
  ],
};

function mapLookupOptions(
  response?: LookupSelectOption[] | { options?: LookupSelectOption[] },
) {
  const options = Array.isArray(response)
    ? response
    : Array.isArray(response?.options)
      ? response.options
      : [];

  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function useLookupOptions(
  group: string,
  fallbackOptions: LookupSelectOption[] = fallbackLookups[group] ?? [],
) {
  const query = useQuery({
    queryKey: ["lookup", group],
    queryFn: () => fetchLookupGroup(group),
  });

  const apiOptions = mapLookupOptions(query.data);
  const options = apiOptions.length ? apiOptions : fallbackOptions;

  return {
    ...query,
    options,
    isUsingFallback: !apiOptions.length,
  };
}
