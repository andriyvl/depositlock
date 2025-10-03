"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContract } from "@/lib/features/shared/contract.hook";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";

interface DisputeFormProps {
  agreement: Agreement;
  contractAddress: string;
  onSuccess?: () => void;
}

export function DisputeForm({ agreement, contractAddress, onSuccess }: DisputeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [proposedAmount, setProposedAmount] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openDispute } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim() || !proposedAmount.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await openDispute(contractAddress, reason, proposedAmount);
      setIsOpen(false);
      setReason("");
      setProposedAmount("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to open dispute:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxAmount = parseFloat(agreement.amount);
  const proposedValue = parseFloat(proposedAmount) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Open Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Open Dispute</DialogTitle>
          <DialogDescription>
            Explain the issue and propose a resolution for this deposit agreement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Dispute Reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain the issue with this agreement..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proposedAmount">
              Proposed Release Amount ({agreement.currency})
            </Label>
            <Input
              id="proposedAmount"
              type="number"
              step="0.01"
              min="0"
              max="0"
              disabled={true}
              placeholder="0.00"
              value={proposedAmount}
              onChange={(e) => setProposedAmount(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Maximum: {agreement.amount} {agreement.currency}
            </p>
            {proposedValue > maxAmount && (
              <p className="text-sm text-destructive">
                Amount cannot exceed the deposit amount
              </p>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> Opening a dispute will require direct communication with the creator.
              The creator must determine the final release amount and contact the depositor to resolve the dispute.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!reason.trim() || !proposedAmount.trim() || proposedValue > maxAmount || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opening Dispute...
                </>
              ) : (
                'Open Dispute'
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