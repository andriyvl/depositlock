"use client";

import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { polygon, arbitrum, optimism, base, mantle, mainnet } from '@reown/appkit/networks';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined. Please set it in .env.local');
}

const url = typeof window !== 'undefined' ? window?.location.origin : "https://depositlock.devviy.com";

const metadata = {
  name: "DepositLock",
  description: "DepositLock",
  url: url,
  icons: [url + "/favicon.svg"],
};

const supportedNetworks: [typeof polygon, typeof arbitrum, typeof optimism, typeof base, typeof mantle, typeof mainnet] = [
  polygon,
  arbitrum,
  optimism,
  base,
  mantle,
  mainnet,
];

const resolveWalletDefaultNetwork = () => {
  if (typeof window === 'undefined') return undefined;

  const rawChainId = (window as { ethereum?: { chainId?: string | number } }).ethereum?.chainId;
  if (!rawChainId) return undefined;

  const chainId =
    typeof rawChainId === 'string'
      ? Number.parseInt(rawChainId, rawChainId.startsWith('0x') ? 16 : 10)
      : Number(rawChainId);

  if (!Number.isFinite(chainId)) return undefined;
  return supportedNetworks.find((network) => network.id === chainId);
};

const walletDefaultNetwork = resolveWalletDefaultNetwork();

console.log('🔗 Initializing AppKit', url);
console.log('🔗 AppKit Metadata', metadata);
console.log('🔗 AppKit Project ID', projectId);
console.log('🔗 AppKit Wallet Default Network', walletDefaultNetwork?.name || 'none');

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  projectId,
  networks: supportedNetworks,
  defaultNetwork: walletDefaultNetwork,
  themeVariables: {
    '--w3m-z-index': 51,
  }
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
