"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clipboard,
  House,
  Link as LinkIcon,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/features/auth/auth.hook";

export function ContractEntry() {
  const [depositLink, setDepositLink] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = useAuth();

  const handleAuthentication = async () => {
    if (!auth.isAuthenticated) {
      try {
        await auth.login();
      } catch (loginError) {
        console.error("Authentication failed:", loginError);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!depositLink.trim()) {
      setError("Please enter a deposit link or contract ID.");
      return;
    }

    await handleAuthentication();
    if (!auth.isAuthenticated) {
      setError("Authentication is required before you can continue.");
      return;
    }

    setIsValidating(true);

    try {
      let contractId = depositLink.trim();

      if (contractId.includes("/contract/")) {
        contractId = contractId.split("/contract/")[1]!;
      } else if (contractId.includes("/depositor/")) {
        contractId = contractId.split("/depositor/")[1]!;
      } else if (contractId.includes("/deposit/")) {
        contractId = contractId.split("/deposit/")[1]!;
      }

      if (contractId.length < 10) {
        throw new Error("Invalid contract ID format.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.push(`/contract/${contractId}`);
    } catch (validationError) {
      const typedError = validationError as Error;
      setError(typedError.message || "Invalid deposit link or contract ID.");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDepositLink(text);
        setError("");
      }
    } catch (clipboardError) {
      console.error("Failed to read clipboard:", clipboardError);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8 sm:py-12">
        <div className="grid gap-6">
          <section className="space-y-6 rounded-[2.5rem] border border-border/70 bg-white/82 p-7 shadow-card backdrop-blur-sm sm:p-8">
            <Badge variant="primary" size="m">
              Depositor flow
            </Badge>
            <div className="space-y-4">
              <h1 className="font-display text-4xl tracking-[-0.06em] font-black text-foreground sm:text-5xl">
                Open a deposit agreement from one link.
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Paste the contract URL or ID you received from the rental business. DepositLock
                will authenticate your wallet, validate the link, and take you to the live contract page.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "What to check",
                  description: "Amount, token, network, and deadline should match what you agreed with the business.",
                  icon: ShieldCheck,
                },
                {
                  title: "What to paste",
                  description: "A full contract link or a raw contract ID both work on this screen.",
                  icon: LinkIcon,
                },
                {
                  title: "What happens next",
                  description: "You authenticate the wallet first, then continue to the contract page for funding.",
                  icon: Wallet,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="grid gap-4 rounded-[1.75rem] border border-border/60 bg-muted/60 p-4 md:grid-cols-[auto_1fr]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-[1.25rem] font-semibold leading-tight tracking-[-0.025em] text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-secondary text-secondary-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <LinkIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-white">Enter deposit information</CardTitle>
                    <CardDescription className="text-white/68">
                      Paste the contract link shared with you or enter the contract ID directly.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div>
                    <Label htmlFor="depositLink">Deposit link or contract ID</Label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="depositLink"
                        type="text"
                        placeholder="https://depositlock.devviy.com/contract/0x... or 0x742d35Cc6634C0532925a3b8D404A7e64ef9d4F7"
                        value={depositLink}
                        onChange={(event) => setDepositLink(event.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handlePasteFromClipboard}>
                        <Clipboard className="h-4 w-4" />
                        Paste
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Full links, legacy links, and plain contract IDs are accepted.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-[1.75rem] border border-destructive-200 bg-destructive-100/80 p-4 text-destructive-800">
                      <p className="text-sm font-semibold uppercase tracking-[0.04em]">Validation issue</p>
                      <p className="mt-2 text-sm leading-7">{error}</p>
                    </div>
                  )}

                  {auth.error && (
                    <div className="rounded-[1.75rem] border border-destructive-200 bg-destructive-100/80 p-4 text-destructive-800">
                      <p className="text-sm font-semibold uppercase tracking-[0.04em]">Wallet authentication</p>
                      <p className="mt-2 text-sm leading-7">{auth.error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isValidating || auth.isAuthLoading}
                    size="lg"
                    className="w-full"
                  >
                    {isValidating || auth.isAuthLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {auth.isAuthLoading ? "Authenticating wallet..." : "Validating contract..."}
                      </>
                    ) : (
                      <>
                        Access deposit
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
