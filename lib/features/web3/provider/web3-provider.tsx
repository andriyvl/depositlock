"use client";

import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { polygon } from '@reown/appkit/networks';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID as string;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined. Please set it in .env.local');
}

const url = typeof window !== 'undefined' ? window?.location.origin : "https://depositlock.devviy.com";

const metadata = {
  name: "DepositLock",
  description: "DepositLock",
  url: url,
  icons: [url + "/favicon.ico"],
};

console.log('🔗 Initializing AppKit', url);
console.log('🔗 AppKit Metadata', metadata);
console.log('🔗 AppKit Project ID', projectId);

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  projectId,
  networks: [polygon],
  themeVariables: {
    '--w3m-z-index': 51,
  }
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
