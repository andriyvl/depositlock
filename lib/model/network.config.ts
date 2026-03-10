import { polygonAmoy, polygon, mainnet, arbitrum, optimism, base, mantle, Assign, Chain } from '@reown/appkit/networks';

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
  optimism = 10,
  base = 8453,
  mantle = 5000,
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
  optimism = `${ChainNamespace.EVM}:${EthereumChainId.optimism}`,
  base = `${ChainNamespace.EVM}:${EthereumChainId.base}`,
  mantle = `${ChainNamespace.EVM}:${EthereumChainId.mantle}`,
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
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.arbitrum]: {
    displayName: 'Arbitrum One',
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
        address: '0xFd086bC7CD5C481DCC9C85ebe478A1C0b69FCbb9',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.optimism]: {
    displayName: 'Optimism',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.base]: {
    displayName: 'Base',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
        decimals: 6,
      },
    ],
  },
  [SupportedNetworkIds.mantle]: {
    displayName: 'Mantle',
    supportedTokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
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
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
      },
    ],
  },
};


const BASE_CONFIGS = {
  [SupportedNetworkIds.polygonAmoy]: polygonAmoy,
  [SupportedNetworkIds.polygon]: polygon,
  [SupportedNetworkIds.arbitrum]: arbitrum,
  [SupportedNetworkIds.optimism]: optimism,
  [SupportedNetworkIds.base]: base,
  [SupportedNetworkIds.mantle]: mantle,
  [SupportedNetworkIds.ethereum]: mainnet,
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

export const DEPLOYMENT_NETWORKS: SupportedNetworkIds[] = [
  SupportedNetworkIds.polygon,
  SupportedNetworkIds.arbitrum,
  SupportedNetworkIds.optimism,
  SupportedNetworkIds.base,
  SupportedNetworkIds.mantle,
  SupportedNetworkIds.ethereum,
];


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

export function getSupportedNetworkIdFromChainId(chainId: number): SupportedNetworkIds | undefined {
  const entry = Object.entries(NETWORK_CONFIGS).find(([, config]) => config.id === chainId);
  return entry?.[0] as SupportedNetworkIds | undefined;
}

export function normalizeSupportedNetworkId(
  value: string | number | null | undefined
): SupportedNetworkIds | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return getSupportedNetworkIdFromChainId(value);
  }

  if (Object.hasOwn(NETWORK_CONFIGS, value)) {
    return value as SupportedNetworkIds;
  }

  const parsedChainId = Number.parseInt(value, value.startsWith('0x') ? 16 : 10);
  if (!Number.isFinite(parsedChainId)) {
    return undefined;
  }

  return getSupportedNetworkIdFromChainId(parsedChainId);
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
