"use client";

import { Badge } from "@/components/ui/badge";
import { BaseHeader } from "./base-header";

export function DepositorHeader() {
  return (
    <BaseHeader>
      <Badge variant="secondary">
        Depositor Mode
      </Badge>
    </BaseHeader>
  );
}