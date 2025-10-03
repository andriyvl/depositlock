"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { Agreement } from "@/lib/model/agreement.types";
import { useContract } from "@/lib/features/shared/contract.hook";

interface ReleaseFormProps {
  agreement: Agreement;
  contractAddress: string;
  onSuccess?: () => void;
}

export function ReleaseForm({ agreement, contractAddress, onSuccess }: ReleaseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [releaseAmount, setReleaseAmount] = useState(agreement.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { releaseFunds } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !releaseAmount.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await releaseFunds(contractAddress, releaseAmount, description);
      setIsOpen(false);
      setDescription("");
      setReleaseAmount(agreement.amount);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to release funds:", error);
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
          Release Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Release Funds</DialogTitle>
          <DialogDescription>
            Release funds to the depositor and provide a description of the resolution.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="releaseAmount">
              Release Amount ({agreement.currency})
            </Label>
            <Input
              id="releaseAmount"
              type="number"
              step="0.01"
              min={agreement.amount}
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
            <Label htmlFor="description">Release Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the reason for this release..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          {remainingAmount > 0 && (
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
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!description.trim() || !releaseAmount.trim() || releaseValue > maxAmount || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Releasing Funds...
                </>
              ) : (
                'Release Funds'
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