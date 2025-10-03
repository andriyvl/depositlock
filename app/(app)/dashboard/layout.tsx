import { DashboardHeader } from "@/lib/features/headers/dashboard-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main>{children}</main>
    </div>
  );
}
