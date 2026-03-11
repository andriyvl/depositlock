import type { Metadata } from "next";
import { CreatorHeader } from "@/lib/features/headers/creator-header";

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

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <CreatorHeader />
      <main>{children}</main>
    </div>
  );
}
