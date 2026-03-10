"use client";

import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Loader2 } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";
import { useContract } from "@/lib/features/shared/contract.hook";
import { showToast } from "@/lib/features/shared/components/show-toast";
import { useEffect, useRef, useState } from "react";

interface DepositFormProps {
  agreement: Agreement;
  contractAddress: string;
  onSuccess?: () => void;
}

export function DepositForm({ agreement, contractAddress, onSuccess }: DepositFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(agreement.amount);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingApproval, setIsCheckingApproval] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [hasEnoughBalance, setHasEnoughBalance] = useState(true);
    const [currentBalance, setCurrentBalance] = useState("0");
    const [tokenSymbol, setTokenSymbol] = useState(agreement.currency);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { approveDeposit, fillContract, getDepositApprovalState } = useContract();
    const getDepositApprovalStateRef = useRef(getDepositApprovalState);

    useEffect(() => {
      getDepositApprovalStateRef.current = getDepositApprovalState;
    }, [getDepositApprovalState]);

    useEffect(() => {
      if (!isOpen) {
        setAmount(agreement.amount);
        setErrorMessage(null);
        return;
      }

      let isCancelled = false;

      const loadApprovalState = async () => {
        setIsCheckingApproval(true);
        setErrorMessage(null);

        try {
          const approvalState = await getDepositApprovalStateRef.current(contractAddress);
          if (isCancelled) {
            return;
          }

          setIsApproved(approvalState.isApproved);
          setHasEnoughBalance(approvalState.hasEnoughBalance);
          setCurrentBalance(ethers.formatUnits(approvalState.balance, agreement.tokenDecimals));
          setTokenSymbol(approvalState.tokenSymbol);
        } catch (error: any) {
          if (isCancelled) {
            return;
          }

          setErrorMessage(error?.message || "Failed to check token approval status.");
        } finally {
          if (!isCancelled) {
            setIsCheckingApproval(false);
          }
        }
      };

      void loadApprovalState();

      return () => {
        isCancelled = true;
      };
    }, [agreement.amount, contractAddress, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!amount.trim()) {
          return;
        }
    
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
          const latestApprovalState = await getDepositApprovalStateRef.current(contractAddress);
          setIsApproved(latestApprovalState.isApproved);
          setHasEnoughBalance(latestApprovalState.hasEnoughBalance);
          setCurrentBalance(ethers.formatUnits(latestApprovalState.balance, agreement.tokenDecimals));
          setTokenSymbol(latestApprovalState.tokenSymbol);

          if (!latestApprovalState.hasEnoughBalance) {
            throw new Error(
              `Insufficient ${latestApprovalState.tokenSymbol} balance on ${agreement.networkName}. Required ${agreement.amount} ${latestApprovalState.tokenSymbol}, wallet has ${ethers.formatUnits(latestApprovalState.balance, agreement.tokenDecimals)} ${latestApprovalState.tokenSymbol}.`
            );
          }

          if (!latestApprovalState.isApproved) {
            await approveDeposit(contractAddress);

            const approvalState = await getDepositApprovalStateRef.current(contractAddress);
            setIsApproved(approvalState.isApproved);
            setHasEnoughBalance(approvalState.hasEnoughBalance);
            setCurrentBalance(ethers.formatUnits(approvalState.balance, agreement.tokenDecimals));
            setTokenSymbol(approvalState.tokenSymbol);

            if (!approvalState.isApproved) {
              throw new Error(`Approval for ${approvalState.tokenSymbol} is still pending. Please try again.`);
            }

            showToast(`${approvalState.tokenSymbol} approved. Submit again to deposit funds.`, "success");
            return;
          }

          await fillContract(contractAddress);
          setIsOpen(false);
          setAmount(agreement.amount);
          setIsApproved(false);
          showToast("Deposit completed successfully.", "success");
          onSuccess?.();
        } catch (error: any) {
          console.error("Failed to deposit funds:", error);
          setErrorMessage(error?.message || "Failed to submit deposit transaction.");
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
                <p className="text-sm text-muted-foreground">
                  {isCheckingApproval
                    ? "Checking token approval status..."
                    : isApproved
                      ? `Approval confirmed. You can now deposit ${tokenSymbol}.`
                      : `Step 1: approve ${tokenSymbol}. Step 2: submit the deposit.`}
                </p>
                {!hasEnoughBalance && (
                  <p className="text-sm text-destructive">
                    Wallet balance is {currentBalance} {tokenSymbol}. You need {agreement.amount} {tokenSymbol} to fill this agreement.
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
              </div>
    
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={!amount.trim() || depositValue > maxAmount || isSubmitting || isCheckingApproval}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isApproved ? "Depositing Funds..." : `Approving ${tokenSymbol}...`}
                    </>
                  ) : (
                    isApproved ? 'Deposit Funds' : `Approve ${tokenSymbol}`
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
