"use client";

import { BaseHeader } from "./base-header";
import { UnifiedBadge } from "@/lib/features/shared";

export function CreatorHeader() {
  return (
    <BaseHeader>
      <UnifiedBadge type="mode-creator" size="m" />
    </BaseHeader>
  );
}