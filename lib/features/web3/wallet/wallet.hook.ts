// Ensure AppKit is initialized before using hooks
import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { getReadonlyProvider } from '../provider/appkit.client';
import { useState, useEffect, useCallback } from 'react';
import { NETWORK_CONFIGS, SupportedNetworkIds } from '@/lib/model/network.config';


export function useWallet() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider('eip155');

  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | undefined>(
    getReadonlyProvider()
  );
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);

  useEffect(() => {
    if (walletProvider) {
      const newProvider = new ethers.BrowserProvider(walletProvider as any);
      setProvider(newProvider);
      newProvider.getSigner().then(setSigner).catch(() => setSigner(undefined));
    } else {
      setProvider(getReadonlyProvider());
      setSigner(undefined);
    }
  }, [walletProvider]);

  const getAddress = useCallback(async () => {
    try {
      const s = signer;
      if (!s) return undefined;
      return await s.getAddress();
    } catch {
      return undefined;
    }
  }, [signer]);

  const ensureNetwork = useCallback(async (networkId: SupportedNetworkIds): Promise<boolean> => {
    try {
      if (!walletProvider) return true; // read-only
      if (selectedNetworkId === networkId) return true;

      const chainConfig = NETWORK_CONFIGS[networkId];
      if (!chainConfig) {
        throw new Error(`Unsupported network: ${networkId}`);
      }

      await (walletProvider as any).request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainConfig.id.toString(16)}` }]
      });
      return true;
    } catch (switchError: any) {
      // Try to add chain then switch
      try {
        const chainConfig = NETWORK_CONFIGS[networkId];
        if (!chainConfig) return false;

        const rpcUrls = chainConfig.rpcUrls?.default?.http || [];
        const explorerUrl = chainConfig.blockExplorers?.default?.url;
        if (!rpcUrls.length) return false;

        await (walletProvider as any).request?.({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainConfig.id.toString(16)}`,
            chainName: chainConfig.name,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls,
            ...(explorerUrl ? { blockExplorerUrls: [explorerUrl] } : {}),
          }]
        });
        return true;
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error(`Failed to add/switch network ${networkId}`, addError);
        return false;
      }
    }
  }, [walletProvider, selectedNetworkId]);

  async function connectWallet() {
    await open();
  }


  return {
    open,
    connectWallet,
    address,
    chainId: selectedNetworkId,
    isConnected,
    provider,
    getSigner: () => signer,
    getAddress,
    selectedNetworkId,
    ensureNetwork
  };
}
