import { CreatorHeader } from "@/lib/features/headers/creator-header";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <CreatorHeader />
      <main>{children}</main>
    </div>
  );
}
