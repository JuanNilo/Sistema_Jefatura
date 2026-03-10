import "./../styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { AppProviders } from "@/components/layout/app-providers";

export const metadata: Metadata = {
  title: "Seguimiento de Casos Estudiantiles",
  description: "MVP de seguimiento de casos estudiantiles"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

