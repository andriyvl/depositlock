import { ContractHeader } from "@/lib/features/headers/contract-header";

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <ContractHeader />
      <main>{children}</main>
    </div>
  );
}
