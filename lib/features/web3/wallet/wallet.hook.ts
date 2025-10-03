// Ensure AppKit is initialized before using hooks
import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState, useDisconnect } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { getReadonlyProvider } from '../provider/appkit.client';
import { useState, useEffect, useCallback } from 'react';
import { polygonAmoy } from '@reown/appkit/networks'
import { SupportedNetworkIds } from '@/lib/model/network.config';


export function useWallet() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider('eip155');
  const { disconnect } = useDisconnect();

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

  const ensureAmoyNetwork = useCallback(async (): Promise<boolean> => {
    try {
      if (!walletProvider) return true; // read-only
      if (selectedNetworkId === SupportedNetworkIds.polygonAmoy) return true;
      
      await (walletProvider as any).request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${polygonAmoy.id.toString(16)}` }]
      });
      return true;
    } catch (switchError: any) {
      // Try to add chain then switch
      try {
        await (walletProvider as any).request?.({
          method: 'wallet_addEthereumChain',
          params: [polygonAmoy]
        });
        return true;
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error('Failed to add/switch to Amoy network', addError);
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
    ensureAmoyNetwork
  };
}
