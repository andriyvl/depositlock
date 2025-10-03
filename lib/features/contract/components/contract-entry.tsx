"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/features/auth/auth.hook";
import { 
  Lock, ArrowRight, Link as LinkIcon, Loader2, AlertCircle, Wallet
} from "lucide-react";

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
      } catch (error) {
        console.error('Authentication failed:', error);
        return;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!depositLink.trim()) {
      setError("Please enter a deposit link or contract ID");
      return;
    }

    await handleAuthentication();
    if (!auth.isAuthenticated) {
      setError("Authentication required to proceed");
      return;
    }

    setIsValidating(true);

    try {
      let contractId = depositLink.trim();
      if (contractId.includes('/contract/')) {
        contractId = contractId.split('/contract/')[1]!;
      } else if (contractId.includes('/depositor/')) {
        // old path compatibility
        contractId = contractId.split('/depositor/')[1]!;
      } else if (contractId.includes('/deposit/')) {
        // old path compatibility
        contractId = contractId.split('/deposit/')[1]!;
      }

      if (contractId.length < 10) {
        throw new Error("Invalid contract ID format");
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push(`/contract/${contractId}`);
    } catch (error: any) {
      setError(error.message || "Invalid deposit link or contract ID");
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
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen">

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-tertiary-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Deposit Agreement</h1>
          <p className="text-muted-foreground text-lg">
            Enter your deposit link or contract ID to view and fill the deposit
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="w-5 h-5 mr-2" />
              Enter Deposit Information
            </CardTitle>
            <CardDescription>
              Paste the deposit link shared with you or enter the contract ID directly
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="depositLink">Deposit Link or Contract ID</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="depositLink"
                    type="text"
                    placeholder="https://depositlock.com/contract/0x742d35... or 0x742d35..."
                    value={depositLink}
                    onChange={(e) => setDepositLink(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handlePasteFromClipboard} className="px-3">
                    Paste
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You can paste a full deposit link or just the contract ID
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Error</h4>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {auth.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Wallet className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Authentication Error</h4>
                      <p className="text-sm text-red-700 mt-1">{auth.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-secondary-800">Secure Access</h4>
                    <p className="text-sm text-secondary-700 mt-1">
                      We'll authenticate your wallet before allowing you to view or interact with the deposit agreement.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isValidating || auth.isAuthLoading} className="w-full bg-gradient-to-r from-secondary-600 to-tertiary-600 hover:from-secondary-500 hover:to-tertiary-500" size="lg">
                {isValidating || auth.isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {auth.isAuthLoading ? 'Authenticating...' : 'Validating...'}
                  </>
                ) : (
                  <>
                    Access Deposit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Don't have a deposit link?</p>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 shadow-lg border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Valid Link Examples:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• https://depositlock.com/contract/0x742d35...</li>
                  <li>• depositlock.com/contract/0x742d35...</li>
                  <li>• 0x742d35Cc6634C0532925a3b8D404A7e64ef9d4F7</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">What happens next:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Connect your wallet securely</li>
                  <li>• View deposit agreement details</li>
                  <li>• Make deposit if you agree to terms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
