"use client";

import { usePathname } from "next/navigation";
import { HomeFooter } from "@/lib/features/home/home-footer";
import { HomeHeader } from "@/lib/features/headers/home-header";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show header/footer for app routes (they have their own headers)
  const isAppRoute = pathname.startsWith('/creator') || 
                     pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/contract');

  if (isAppRoute) {
    return <>{children}</>;
  }

  // Show header and footer for home page and other public pages
  return (
    <>
        <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
    </>
  );
}