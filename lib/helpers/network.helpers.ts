import { ChainNamespace, NETWORK_CONFIGS, SupportedNetworkIds } from '@/lib/model/network.config';
import { getReadonlyProvider } from '@/lib/features/web3/provider/appkit.client';

export function getNetworkFromChainId(chainId: number): string {
  const network = Object.values(NETWORK_CONFIGS).find(
    (config) => config.id === chainId
  );
  console.log('network', network);
  return network ? network.id.toString() : 'unknown';
}

export function getChainIdFromNetwork(network: string): number {
  const config = NETWORK_CONFIGS[network as SupportedNetworkIds];
  return config ? config.id : 0;
}

export async function getNetworkIdFromProvider(): Promise<SupportedNetworkIds> {
  const provider = getReadonlyProvider();
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkId = `${ChainNamespace.EVM}:${chainId}` as SupportedNetworkIds;
  return networkId;
}