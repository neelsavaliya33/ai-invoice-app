import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NetworkOverlay } from "@/components/network-overlay";

export const metadata: Metadata = {
  title: "KoshPilot - AI invoice workflow",
  description: "AI-powered billing, inventory, accounting, reports, and user management for Indian MSMEs.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32.png",
    apple: "/brand/koshpilot-icon-256.png",
  },
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
