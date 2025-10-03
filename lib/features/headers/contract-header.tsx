"use client";

import { BaseHeader } from "./base-header";
import { useAuth } from "@/lib/features/auth/auth.hook";
import { useParams } from "next/navigation";
import { UnifiedBadge } from "@/lib/features/shared";
import { useAppStore } from "@/lib/features/store/app.store";

export function ContractHeader() {
  const auth = useAuth();
  const params = useParams<{ contractId: string }>();
  const contractId = params?.contractId;
  const { currentAgreement } = useAppStore();

  // Determine if the current user is the creator
  const isCreator = auth.user?.address && currentAgreement?.creator &&
    auth.user.address.toLowerCase() === currentAgreement.creator.toLowerCase();
  const isDepositor = auth.user?.address && currentAgreement?.depositor &&
    auth.user.address.toLowerCase() === currentAgreement.depositor.toLowerCase();

  return (
    <BaseHeader>
      {isCreator && <UnifiedBadge size="m" type="mode-creator" />}
      {(!isCreator || isDepositor) && <UnifiedBadge size="m" type="mode-depositor" />}
    </BaseHeader>
  );
}