import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NetworkOverlay } from "@/components/network-overlay";

export const metadata: Metadata = {
  title: "LedgerAI - AI invoice workflow",
  description: "AI-powered billing, inventory, customers, reports, and user management for Indian MSMEs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <NetworkOverlay />
        </Providers>
      </body>
    </html>
  );
}
