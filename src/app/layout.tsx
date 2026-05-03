import "../styles/globals.css";
import type { Metadata } from "next";
import React from "react";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import ClientProviders from "../components/auth/ClientProviders";
import { ThemeInit } from "../components/theme/ThemeInit";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DevFlow",
  description: "DevFlow Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeInit />
        <ClientProviders>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ClientProviders>
      </body>
    </html>
  );
}
