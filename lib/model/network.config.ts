import { polygonAmoy, polygon, mainnet, arbitrum, Assign, Chain } from '@reown/appkit/networks';

export enum ChainNamespace {
  EVM = 'eip155',
  solana = 'solana',
  polkadot = 'polkadot',
  bitcoin = 'bip122',
  cosmos = 'cosmos',
}
export enum EthereumChainId {
  polygonAmoy = 80002,
  polygon = 137,
  ethereum = 1,
  arbitrum = 42161,
}

export interface AppNetworkConfig extends Assign<Chain<undefined>, Chain> {
  displayName: string;
  supportedTokens: Array<{
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  }>;
}

//  import("@reown/appkit-common").CaipNetworkId
export enum SupportedNetworkIds {
  polygonAmoy = `${ChainNamespace.EVM}:${EthereumChainId.polygonAmoy}`,
  polygon = `${ChainNamespace.EVM}:${EthereumChainId.polygon}`,
  ethereum = `${ChainNamespace.EVM}:${EthereumChainId.ethereum}`,
  arbitrum = `${ChainNamespace.EVM}:${EthereumChainId.arbitrum}`,
}

const APP_NETWORK_CONFIG: Record<SupportedNetworkIds, Partial<AppNetworkConfig>> = {
  [SupportedNetworkIds.polygonAmoy]: {
    displayName: 'Polygon Amoy Testnet',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.polygon]: {
    displayName: 'Polygon Mainnet (Production)',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.ethereum]: {
    displayName: 'Ethereum (Higher Fees)',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimals: 6,
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        decimals: 18,
      },
    ],
  },
  [SupportedNetworkIds.arbitrum]: {
    displayName: 'Arbitrum (Low Fees)',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        decimals: 6,
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        decimals: 18,
      },
    ],
  },
};


const BASE_CONFIGS = {
  [SupportedNetworkIds.polygonAmoy]: polygonAmoy,
  [SupportedNetworkIds.polygon]: polygon,
  [SupportedNetworkIds.ethereum]: mainnet,
  [SupportedNetworkIds.arbitrum]: arbitrum,
};


// Augment the base configs with app-specific details
export const NETWORK_CONFIGS: Record<SupportedNetworkIds, AppNetworkConfig> = Object.entries(
  BASE_CONFIGS
).reduce((acc, [key, baseConfig]) => {
  const appConfig = APP_NETWORK_CONFIG[key as SupportedNetworkIds];
  if (appConfig) {
    acc[key as SupportedNetworkIds] = {
      ...baseConfig,
      ...appConfig,
    } as AppNetworkConfig;
  }
  return acc;
}, {} as Record<SupportedNetworkIds, AppNetworkConfig>);


export function getNetworkConfig(networkId: SupportedNetworkIds): AppNetworkConfig | undefined {
  return NETWORK_CONFIGS[networkId];
}

export function getSupportedCurrencies(networkId: SupportedNetworkIds): Array<{ symbol: string; name: string }> {
  const config = getNetworkConfig(networkId);
  return (config?.supportedTokens || []).map(({ symbol, name }) => ({ symbol, name }));
}

export function getTokenConfig(
  networkId: SupportedNetworkIds,
  symbol: string
): { symbol: string; name: string; address: string; decimals: number } | undefined {
  const config = getNetworkConfig(networkId);
  if (!config) return undefined;

  return config.supportedTokens.find((token) => token.symbol === symbol);
}

export function getNetworkDisplayName(networkId: SupportedNetworkIds): string {
  const config = getNetworkConfig(networkId);
  return config?.displayName || networkId;
}

export function getDefaultCurrency(networkId: SupportedNetworkIds): string {
  const config = getNetworkConfig(networkId);
  if (!config) return 'USDC';

  const stablecoins = ['USDC', 'USDT', 'DAI'];
  const availableStablecoin = config.supportedTokens.find((token) =>
    stablecoins.includes(token.symbol)
  );

  return availableStablecoin?.symbol || config.supportedTokens[0]?.symbol || 'USDC';
}
