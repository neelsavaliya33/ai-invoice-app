import { StatusPage } from "@/components/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Nothing to bill here"
      title="This page is not in your workspace."
      description="The link may be old, the page may have moved, or the module path may be typed incorrectly."
      details={[
        "Open the dashboard to continue with invoices, inventory, GST, reports, payroll, or AI Copilot.",
        "If you followed a saved link, check whether the selected company or module still exists.",
        "Use the home page if you want to restart from the public KoshPilot experience.",
      ]}
      primaryHref="/app"
      primaryLabel="Open dashboard"
      secondaryHref="/"
      secondaryLabel="Go to home"
    />
  );
}
