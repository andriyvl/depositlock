import { SupportedNetworkIds } from "./network.config";

export interface User {
  address: string;
  isConnected: boolean;
  networkId: SupportedNetworkIds;
}

export enum AgreementStatus {
  pending = 0,
  filled = 1,
  released = 2,
  disputed = 3,
  canceled = 4,
}

export type AgreementStatusName = 'pending' | 'filled' | 'released' | 'disputed' | 'canceled';

export const AGREEMENT_STATUS: Record<AgreementStatus, AgreementStatusName> = {
  [AgreementStatus.pending]: 'pending',
  [AgreementStatus.filled]: 'filled',
  [AgreementStatus.released]: 'released',
  [AgreementStatus.disputed]: 'disputed',
  [AgreementStatus.canceled]: 'canceled',
}

export type UserContractRole = 'creator' | 'depositor';


export interface UserDatabaseContract {
  contractAddress: string;
  role: UserContractRole;
  networkId: SupportedNetworkIds;
  createdAt: string;
}

export interface BlockchainContract {
  contractAddress: string;
  creator: string;
  depositor: string;
  amount: string;
  currency: string;
  deadline: string;
  status: AgreementStatus;
  title: string;
  description: string;
  networkId: SupportedNetworkIds;
  discoveredAt: string;
  transactionHash?: string;
  blockNumber?: number;
  createdAt: string | null;
  filledAt: string | null;
  releasedAt: string | null;
  releasedAmount: string | null;
  releaseDescription: string | null;
  disputedAt: string | null;
  proposedAmount: string | null;
  disputeReason: string | null;
  canceledAt: string | null;
  cancelReason: string | null;
}

export type Agreement = BlockchainContract & {
  id: string;
  role: UserContractRole;
  counterparty: string;
  createdAt: string;
  filledAt: string | null;
  releasedAt: string | null;
  canceledAt: string | null;
  disputedAt: string | null;
  releasedAmount: string | null;
  proposedAmount: string | null;
  networkName: string;
  statusName: AgreementStatusName;
  disputeReason: string | null;
  releaseDescription: string | null;
  cancelReason: string | null;
};

