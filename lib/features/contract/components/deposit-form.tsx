"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Loader2 } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";
import { useContract } from "@/lib/features/shared/contract.hook";
import { useState } from "react";

interface DepositFormProps {
  agreement: Agreement;
  contractAddress: string;
  onSuccess?: () => void;
}

export function DepositForm({ agreement, contractAddress, onSuccess }: DepositFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(agreement.amount);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { fillContract } = useContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!amount.trim()) {
          return;
        }
    
        setIsSubmitting(true);
        try {
          await fillContract(contractAddress, amount);
          setIsOpen(false);
          setAmount("");
          onSuccess?.();
        } catch (error) {
          console.error("Failed to deposit funds:", error);
        } finally {
          setIsSubmitting(false);
        }
    };
    
    const maxAmount = parseFloat(agreement.amount);
    const depositValue = parseFloat(amount) || 0;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              Deposit Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>
                You are about to deposit funds into this agreement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Deposit Amount ({agreement.currency})
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  disabled={true}
                  min={agreement.amount}
                  max={agreement.amount}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {/* <p className="text-sm text-muted-foreground">
                  Maximum: {agreement.amount} {agreement.currency}
                </p> */}
                {depositValue > maxAmount && (
                  <p className="text-sm text-destructive">
                    Amount cannot exceed the deposit amount.
                  </p>
                )}
              </div>
    
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={!amount.trim() || depositValue > maxAmount || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Depositing Funds...
                    </>
                  ) : (
                    'Deposit Funds'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      );
}