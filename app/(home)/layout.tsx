import { Lock } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            DepositLock
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                        <Link className="hover:text-foreground transition-colors" href="#features">Features</Link>
                        <Link className="hover:text-foreground transition-colors" href="#how-it-works">How it Works</Link>
                        <Link className="hover:text-foreground transition-colors" href="#pricing">Pricing</Link>
                    </nav>
                    <div className="flex items-center space-x-3">
                        <Link href="/signin" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link>
                        <Link href="/creator" className="px-4 py-2 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">Get Started</Link>
                    </div>
                </div>
            </header>
            <main>{children}</main>
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
        </>
    )
}