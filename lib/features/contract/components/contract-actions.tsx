"use client";

import React, { useState } from "react";
import { useAuth } from "../../auth/auth.hook";
import { Agreement, AgreementStatus } from "@/lib/model/agreement.types";
import { DisputeForm } from "./dispute-form";
import { ReleaseForm } from "./release-form";
import { CancelForm } from "./cancel-form";
import { ResolveDisputeForm } from "./resolve-dispute-form";
import { DepositForm } from "./deposit-form";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useAppStore } from "../../store/app.store";
import { useContract } from "../../shared/contract.hook";
import { useAgreement } from "../../shared/agreement.hook";

interface ContractActionsProps {
  agreement: Agreement;
  contractAddress: string;
}

export function ContractActions({ agreement, contractAddress }: ContractActionsProps) {
  const { isAuthenticated, checkUserRole, user } = useAuth();
  const { emergencyRelease } = useContract();
  const { currentAgreement, setCurrentAgreementStatusEvent } = useAppStore();
  const { fetchAgreement } = useAgreement(contractAddress, user!);

  const { isCreator, isDepositor } = checkUserRole(agreement.creator, agreement.depositor);
  const isParticipant = isCreator || isDepositor;

  // Check if deadline has passed
  const deadline = agreement.deadline ? new Date(agreement.deadline) : null;
  const isDeadlinePassed = deadline ? new Date() > deadline : false;

  const handleEmergencyRelease = async () => {
    try {
      await emergencyRelease(contractAddress);
      onActionComplete(AgreementStatus.released);
    } catch (error) {
      console.error("Failed to perform emergency release:", error);
    }
  };

  const onActionComplete = (status: AgreementStatus) => {
    fetchAgreement();
    setCurrentAgreementStatusEvent(status);
  };

  // No actions available if user is not connected
  if (!isAuthenticated) {
    return null;
  }

  // // No actions for non-participants
  // if (!isParticipant) {
  //   return null;
  // }

  return (
    <div className="space-y-3">
      {/* Creator Actions */}
      {isCreator && (
        <>
          {/* Cancel contract (only for pending contracts) */}
          {currentAgreement?.status === AgreementStatus.pending && (
            <CancelForm
              contractAddress={contractAddress}
              onSuccess={() => onActionComplete(AgreementStatus.canceled)}
            />
          )}

          {/* Release funds (only for filled contracts) */}
          {currentAgreement?.status === AgreementStatus.filled && (
            <ReleaseForm
              agreement={agreement}
              contractAddress={contractAddress}
              onSuccess={() => onActionComplete(AgreementStatus.released)}
            />
          )}

          {/* Resolve dispute (only for disputed contracts) */}
          {currentAgreement?.status === AgreementStatus.disputed && isCreator && (
            <ResolveDisputeForm
              agreement={agreement}
              contractAddress={contractAddress}
              onSuccess={() => onActionComplete(AgreementStatus.released)}
            />
          )}

          {/* Open dispute (only for filled contracts) */}
          {currentAgreement?.status === AgreementStatus.filled && (
            <DisputeForm
              agreement={agreement}
              contractAddress={contractAddress}
              onSuccess={() => onActionComplete(AgreementStatus.disputed)}
            />
          )}
        </>
      )}

      {/* Depositor Actions */}
      {isDepositor && (
        <>
          {currentAgreement?.status === AgreementStatus.pending && (
            <DepositForm
              agreement={agreement}
              contractAddress={contractAddress}
              onSuccess={() => onActionComplete(AgreementStatus.filled)}
            />
          )}
        </>
      )}

      {/* Emergency Release (available to anyone after deadline) */}
      {currentAgreement?.status === AgreementStatus.filled && isDeadlinePassed && (
        <Button
          variant="outline"
          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
          onClick={handleEmergencyRelease}
        >
          <Clock className="w-4 h-4 mr-2" />
          Emergency Release (Deadline Passed)
        </Button>
      )}

      {/* Status Information */}
      <div className="text-sm text-muted-foreground space-y-1">
        {/* Creator info */}
        {
          isCreator && (
            <>
              {currentAgreement?.status === AgreementStatus.pending && (
                <p className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-accent-500" />
                  You can cancel this contract until someone deposits.
                </p>
              )}

              {currentAgreement?.status === AgreementStatus.filled && (
                <p className="flex items-center gap-1 text-md font-medium">
                  <CheckCircle className="w-4 h-4 text-tertiary-500" />
                  You can release funds to resolve this agreement.
                </p>
              )}

              {currentAgreement?.status === AgreementStatus.filled && (
                <p className="flex items-center gap-1 text-md font-medium">
                  <AlertCircle className="w-4 h-4 text-accent-500" />
                  You can open a dispute if there are issues.
                </p>
              )}

              {currentAgreement?.status === AgreementStatus.disputed && (
                <p className="flex items-center gap-1 text-md font-medium">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Please resolve this dispute by determining the final release amount.
                </p>
              )}
            </>
          )
        }


        {/* Depositor info */}
        {
          isDepositor && (
            <>
              {currentAgreement?.status === AgreementStatus.disputed && (
                <p className="flex items-center gap-1 text-md font-medium">
                  <AlertCircle className="w-4 h-4 text-accent-500" />
                  Please contact the Agreement creator to resolve the dispute.
                </p>
              )}

              {currentAgreement?.status === AgreementStatus.filled && !isDeadlinePassed && (
                <>
                  <p className="flex items-center gap-1 text-md font-medium">
                    <CheckCircle className="w-4 h-4 text-tertiary-500" />You have filled the deposit agreement.
                  </p>
                  <p className="text-sm">Please wait untill deadline passed to release funds or until creator releases funds.</p>
                </>
              )}

              {currentAgreement?.status === AgreementStatus.filled && isDeadlinePassed && (
                <p className="flex items-center gap-1 text-md font-medium">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Emergency release is available.
                </p>
              )}
            </>
          )
        }


        {/* General info */}
        {currentAgreement?.status === AgreementStatus.released && (
          <p className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            This agreement has been completed.
          </p>
        )}

        {currentAgreement?.status === AgreementStatus.canceled && (
          <p className="flex items-center gap-1">
            <XCircle className="w-4 h-4 text-red-600" />
            This agreement has been canceled.
          </p>
        )}
      </div>
    </div>
  );
}