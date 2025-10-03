"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useContract } from "@/lib/features/shared/contract.hook";
import { XCircle, Loader2 } from "lucide-react";

interface CancelFormProps {
  contractAddress: string;
  onSuccess?: () => void;
}

export function CancelForm({ contractAddress, onSuccess }: CancelFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cancelContract } = useContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await cancelContract(contractAddress, reason);
      console.log("tx", tx);
      setIsOpen(false);
      setReason("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to cancel contract:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancel Contract</DialogTitle>
          <DialogDescription>
            Cancel this deposit agreement. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain why you're canceling this agreement..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> Canceling this contract will permanently close it. 
              This action can only be performed on contracts that haven't been filled yet.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant="destructive"
              disabled={!reason.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Canceling Contract...
                </>
              ) : (
                'Cancel Contract'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Keep Contract
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}