import "./globals.css";
import { Providers } from "./providers";
import { type ReactNode } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import { ConditionalLayout } from "./components/conditional-layout";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: "DepositLock – Escrow",
  description: "Crypto-native escrow for deposits",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-custom-gradient text-foreground antialiased`}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
