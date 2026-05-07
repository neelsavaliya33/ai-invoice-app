"use client";

import { RetryButton, StatusPage } from "@/components/status-page";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      code="500"
      eyebrow="Something needs attention"
      title="We could not load this workspace screen."
      description="KoshPilot hit an unexpected issue while preparing this page. Your local demo data is still safe."
      details={[
        "Try again first. Temporary build, network, or API issues often recover on refresh.",
        "If this happened after saving a form, check the list page before creating the record again.",
        "In production, support would receive the server log and error context for faster debugging.",
      ]}
      primaryHref="/app"
      primaryLabel="Open dashboard"
      secondaryHref="/"
      secondaryLabel="Go to home"
      onRetry={<RetryButton onClick={reset} />}
    />
  );
}
