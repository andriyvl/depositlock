// Ensure AppKit is initialized before using hooks
import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { getReadonlyProvider } from '../provider/appkit.client';
import { useState, useEffect, useCallback } from 'react';
import { NETWORK_CONFIGS, SupportedNetworkIds, normalizeSupportedNetworkId } from '@/lib/model/network.config';


export function useWallet() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId: appKitSelectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider('eip155');

  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | undefined>(
    getReadonlyProvider()
  );
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);
  const [selectedNetworkId, setSelectedNetworkId] = useState<SupportedNetworkIds | undefined>(
    normalizeSupportedNetworkId(appKitSelectedNetworkId as string | number | null | undefined)
  );
  const [chainId, setChainId] = useState<number | undefined>(
    selectedNetworkId ? NETWORK_CONFIGS[selectedNetworkId].id : undefined
  );

  const syncSelectedNetwork = useCallback(async (): Promise<SupportedNetworkIds | undefined> => {
    const fallbackNetworkId = normalizeSupportedNetworkId(
      appKitSelectedNetworkId as string | number | null | undefined
    );

    if (!walletProvider) {
      setSelectedNetworkId(fallbackNetworkId);
      setChainId(fallbackNetworkId ? NETWORK_CONFIGS[fallbackNetworkId].id : undefined);
      return fallbackNetworkId;
    }

    try {
      const requestedChainId = await (walletProvider as any).request?.({ method: 'eth_chainId' });
      const resolvedNetworkId = normalizeSupportedNetworkId(
        requestedChainId ?? (appKitSelectedNetworkId as string | number | null | undefined)
      );

      setSelectedNetworkId(resolvedNetworkId);
      setChainId(resolvedNetworkId ? NETWORK_CONFIGS[resolvedNetworkId].id : undefined);

      return resolvedNetworkId;
    } catch {
      try {
        const browserProvider = new ethers.BrowserProvider(walletProvider as any);
        const network = await browserProvider.getNetwork();
        const resolvedNetworkId = normalizeSupportedNetworkId(Number(network.chainId));

        setSelectedNetworkId(resolvedNetworkId);
        setChainId(resolvedNetworkId ? NETWORK_CONFIGS[resolvedNetworkId].id : undefined);

        return resolvedNetworkId;
      } catch {
        setSelectedNetworkId(fallbackNetworkId);
        setChainId(fallbackNetworkId ? NETWORK_CONFIGS[fallbackNetworkId].id : undefined);
        return fallbackNetworkId;
      }
    }
  }, [appKitSelectedNetworkId, walletProvider]);

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

  useEffect(() => {
    void syncSelectedNetwork();
  }, [syncSelectedNetwork]);

  useEffect(() => {
    const chainAwareProvider = walletProvider as {
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    } | undefined;

    if (!chainAwareProvider?.on) {
      return;
    }

    const handleChainChanged = () => {
      void syncSelectedNetwork();
    };

    chainAwareProvider.on('chainChanged', handleChainChanged);

    return () => {
      chainAwareProvider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [syncSelectedNetwork, walletProvider]);

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
      await syncSelectedNetwork();
      return true;
    } catch (switchError: any) {
      if (switchError?.code !== 4902) {
        return false;
      }

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
        await syncSelectedNetwork();
        return true;
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error(`Failed to add/switch network ${networkId}`, addError);
        return false;
      }
    }
  }, [walletProvider, selectedNetworkId, syncSelectedNetwork]);

  async function connectWallet() {
    await open();
  }


  return {
    open,
    connectWallet,
    address,
    chainId,
    isConnected,
    provider,
    getSigner: () => signer,
    getAddress,
    selectedNetworkId,
    ensureNetwork
  };
}
