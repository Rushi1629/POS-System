
import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";
import Providers from "./providers";
import SecretCafeLoader from "@/components/SecretCafeLoader";
import AuthInitializer from "@/components/AuthInitializer";
// import AuthInitializer from "@/components/AuthInitializer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Secret Cafe — Cafe Point of Sale & Operations",
  description:
    "Web-based cafe POS for order taking, table management, billing, inventory, and sales analytics with role-based staff access.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <QueryProvider>
            <AuthInitializer>
              <Suspense fallback={<SecretCafeLoader message="Starting app..." />}>
                {children}
              </Suspense>
            </AuthInitializer>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
