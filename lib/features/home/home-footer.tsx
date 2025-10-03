import Link from "next/link";
import { Lock } from "lucide-react";

export function HomeFooter() {
  return (
<footer className="py-12 px-4 bg-background border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                DepositLock
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 DepositLock. Securing deposits with blockchain technology.
          </div>
        </div>
      </footer>
  );
}