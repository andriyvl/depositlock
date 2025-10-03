  "use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContract } from "@/lib/features/shared/contract.hook";
import { CheckCircle, Loader2 } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";

interface ResolveDisputeFormProps {
  agreement: Agreement;
  contractAddress: string;
  onSuccess?: () => void;
}

export function ResolveDisputeForm({ agreement, contractAddress, onSuccess }: ResolveDisputeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [releaseAmount, setReleaseAmount] = useState(agreement.proposedAmount || agreement.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resolveDispute } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !releaseAmount.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resolveDispute(contractAddress, releaseAmount, description);
      setIsOpen(false);
      setDescription("");
      setReleaseAmount(agreement.proposedAmount || agreement.amount);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to resolve dispute:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxAmount = parseFloat(agreement.amount);
  const releaseValue = parseFloat(releaseAmount) || 0;
  const remainingAmount = maxAmount - releaseValue;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolve Dispute
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
          <DialogDescription>
            Resolve this dispute by determining the final release amount and providing resolution details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {agreement.disputeReason && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Original Dispute:</p>
              <p className="text-sm text-muted-foreground">{agreement.disputeReason}</p>
              {agreement.proposedAmount && (
                <p className="text-sm text-muted-foreground mt-1">
                  Proposed amount: {agreement.proposedAmount} {agreement.currency}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="releaseAmount">
              Final Release Amount ({agreement.currency})
            </Label>
            <Input
              id="releaseAmount"
              type="number"
              step="0.01"
              min="0"
              max={agreement.amount}
              placeholder="0.00"
              value={releaseAmount}
              onChange={(e) => setReleaseAmount(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Maximum: {agreement.amount} {agreement.currency}
            </p>
            {releaseValue > maxAmount && (
              <p className="text-sm text-destructive">
                Amount cannot exceed the deposit amount
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Resolution Description</Label>
            <Textarea
              id="description"
              placeholder="Explain your resolution decision..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Fund Distribution:</strong>
            </p>
            <p className="text-sm">
              • Depositor receives: {releaseValue.toFixed(2)} {agreement.currency}
            </p>
            <p className="text-sm">
              • Creator receives: {remainingAmount.toFixed(2)} {agreement.currency}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!description.trim() || !releaseAmount.trim() || releaseValue > maxAmount || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resolving Dispute...
                </>
              ) : (
                'Resolve Dispute'
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