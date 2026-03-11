"use client";

import { ethers } from 'ethers';
import { SupportedNetworkIds } from '@/lib/model/network.config';

const RPC_BY_NETWORK: Record<SupportedNetworkIds, string> = {
  [SupportedNetworkIds.polygon]: process.env.NEXT_PUBLIC_RPC_POLYGON || 'https://polygon-bor-rpc.publicnode.com',
  [SupportedNetworkIds.polygonAmoy]: process.env.NEXT_PUBLIC_RPC_AMOY || 'https://rpc-amoy.polygon.technology/',
  [SupportedNetworkIds.ethereum]: process.env.NEXT_PUBLIC_RPC_ETHEREUM || 'https://ethereum-rpc.publicnode.com',
  [SupportedNetworkIds.arbitrum]: process.env.NEXT_PUBLIC_RPC_ARBITRUM || 'https://arbitrum-one-rpc.publicnode.com',
  [SupportedNetworkIds.optimism]: process.env.NEXT_PUBLIC_RPC_OPTIMISM || 'https://optimism-rpc.publicnode.com',
  [SupportedNetworkIds.base]: process.env.NEXT_PUBLIC_RPC_BASE || 'https://base-rpc.publicnode.com',
  [SupportedNetworkIds.mantle]: process.env.NEXT_PUBLIC_RPC_MANTLE || 'https://rpc.mantle.xyz',
};

export function getReadonlyRpcUrl(networkId: SupportedNetworkIds = SupportedNetworkIds.polygon): string {
  return RPC_BY_NETWORK[networkId] || RPC_BY_NETWORK[SupportedNetworkIds.polygon];
}

// Read-only provider fallback (no wallet connected)
export function getReadonlyProvider(networkId: SupportedNetworkIds = SupportedNetworkIds.polygon): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(
    getReadonlyRpcUrl(networkId),
    undefined,
    {
      // Avoid provider-side request batching because many public RPCs cap batch size.
      batchMaxCount: 1,
    }
  );
}
