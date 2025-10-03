import "./globals.css";
import { Providers } from "./providers";
import { type ReactNode } from "react";
import { ConditionalLayout } from "./components/conditional-layout";

export const metadata = {
  title: "DepositLock – Escrow",
  description: "Crypto-native escrow for deposits",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-foreground bg-custom-gradient">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
