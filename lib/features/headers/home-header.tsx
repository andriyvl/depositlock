import Link from "next/link";
import { usePathname } from "next/navigation";
import { BaseHeader } from "./base-header";
import { Button } from "@/lib/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/features/auth/auth.context";

function getSectionLink(pathname: string, section: string): string {
  return pathname === "/" ? section : `/${section}`;
}

export function HomeHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <BaseHeader>
      <div className="flex items-center justify-between">
        <nav className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
          <Link className="hover:text-foreground transition-colors" href={getSectionLink(pathname, "#features")}>Features</Link>
          <Link className="hover:text-foreground transition-colors" href={getSectionLink(pathname, "#how-it-works")}>How it Works</Link>
          <Link className="hover:text-foreground transition-colors" href="/faq">FAQ</Link>
          <Link className="hover:text-foreground transition-colors" href="/contact">Contact</Link>
        </nav>

        {user?.isConnected && (
          <Button variant="outline" size="sm" className="ml-3">
            <Link href="/dashboard" className="flex items-center">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:block ml-2">Dashboard</span>
            </Link>
          </Button>
        )}
      </div>
    </BaseHeader>
  );
}
