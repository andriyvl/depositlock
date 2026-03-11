import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState } from "@reown/appkit/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { normalizeSupportedNetworkId, SupportedNetworkIds, NETWORK_CONFIGS } from "@/lib/model/network.config";
import { getReadonlyProvider } from "../provider/appkit.client";

interface WalletProvider {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export function useWallet() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { selectedNetworkId: appKitSelectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider("eip155");

  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | undefined>(
    getReadonlyProvider(),
  );
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>();
  const [selectedNetworkId, setSelectedNetworkId] = useState<SupportedNetworkIds | undefined>(
    normalizeSupportedNetworkId(appKitSelectedNetworkId as string | number | null | undefined),
  );
  const [chainId, setChainId] = useState<number | undefined>(
    selectedNetworkId ? NETWORK_CONFIGS[selectedNetworkId].id : undefined,
  );

  const syncSelectedNetwork = useCallback(async (): Promise<SupportedNetworkIds | undefined> => {
    const fallbackNetworkId = normalizeSupportedNetworkId(
      appKitSelectedNetworkId as string | number | null | undefined,
    );
    const connectedProvider = walletProvider as WalletProvider | undefined;

    if (!connectedProvider) {
      setSelectedNetworkId(fallbackNetworkId);
      setChainId(fallbackNetworkId ? NETWORK_CONFIGS[fallbackNetworkId].id : undefined);
      return fallbackNetworkId;
    }

    try {
      const requestedChainId = await connectedProvider.request?.({ method: "eth_chainId" });
      const resolvedNetworkId = normalizeSupportedNetworkId(
        requestedChainId as string | number | null | undefined,
      );

      setSelectedNetworkId(resolvedNetworkId);
      setChainId(resolvedNetworkId ? NETWORK_CONFIGS[resolvedNetworkId].id : undefined);
      return resolvedNetworkId;
    } catch {
      try {
        const browserProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
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
      const nextProvider = new ethers.BrowserProvider(walletProvider as ethers.Eip1193Provider);
      setProvider(nextProvider);
      nextProvider.getSigner().then(setSigner).catch(() => setSigner(undefined));
      return;
    }

    setProvider(getReadonlyProvider());
    setSigner(undefined);
  }, [walletProvider]);

  useEffect(() => {
    void syncSelectedNetwork();
  }, [syncSelectedNetwork]);

  useEffect(() => {
    const connectedProvider = walletProvider as WalletProvider | undefined;

    if (!connectedProvider?.on) {
      return;
    }

    const handleChainChanged = () => {
      void syncSelectedNetwork();
    };

    connectedProvider.on("chainChanged", handleChainChanged);

    return () => {
      connectedProvider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [syncSelectedNetwork, walletProvider]);

  const getAddress = useCallback(async () => {
    try {
      if (!signer) {
        return undefined;
      }

      return await signer.getAddress();
    } catch {
      return undefined;
    }
  }, [signer]);

  const ensureNetwork = useCallback(async (networkId: SupportedNetworkIds): Promise<boolean> => {
    try {
      const connectedProvider = walletProvider as WalletProvider | undefined;

      if (!connectedProvider) {
        return true;
      }

      if (selectedNetworkId === networkId) {
        return true;
      }

      const chainConfig = NETWORK_CONFIGS[networkId];
      if (!chainConfig) {
        throw new Error(`Unsupported network: ${networkId}`);
      }

      await connectedProvider.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainConfig.id.toString(16)}` }],
      });
      await syncSelectedNetwork();
      return true;
    } catch (switchError) {
      const errorCode =
        typeof switchError === "object" &&
        switchError !== null &&
        "code" in switchError &&
        typeof switchError.code === "number"
          ? switchError.code
          : undefined;

      if (errorCode !== 4902) {
        return false;
      }

      try {
        const connectedProvider = walletProvider as WalletProvider | undefined;
        const chainConfig = NETWORK_CONFIGS[networkId];

        if (!connectedProvider || !chainConfig) {
          return false;
        }

        const rpcUrls = chainConfig.rpcUrls?.default?.http || [];
        const explorerUrl = chainConfig.blockExplorers?.default?.url;

        if (!rpcUrls.length) {
          return false;
        }

        await connectedProvider.request?.({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainConfig.id.toString(16)}`,
              chainName: chainConfig.name,
              nativeCurrency: chainConfig.nativeCurrency,
              rpcUrls,
              ...(explorerUrl ? { blockExplorerUrls: [explorerUrl] } : {}),
            },
          ],
        });
        await syncSelectedNetwork();
        return true;
      } catch (addError) {
        console.error(`Failed to add or switch network ${networkId}`, addError);
        return false;
      }
    }
  }, [selectedNetworkId, syncSelectedNetwork, walletProvider]);

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
    ensureNetwork,
  };
}
