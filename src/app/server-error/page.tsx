import { StatusPage } from "@/components/status-page";

export default function ServerErrorPreviewPage() {
  return (
    <StatusPage
      code="500"
      eyebrow="Something needs attention"
      title="We could not load this workspace screen."
      description="KoshPilot hit an unexpected issue while preparing this page. Your local demo data is still safe."
      details={[
        "Try refreshing the page or returning to the dashboard to continue your work.",
        "If this happened after saving a form, check the list page before creating the record again.",
        "In production, support would receive the server log and error context for faster debugging.",
      ]}
      primaryHref="/app"
      primaryLabel="Open dashboard"
      secondaryHref="/"
      secondaryLabel="Go to home"
    />
  );
}
