import type { Metadata } from "next";
import { ContractHeader } from "@/lib/features/headers/contract-header";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <ContractHeader />
      <main>{children}</main>
    </div>
  );
}
