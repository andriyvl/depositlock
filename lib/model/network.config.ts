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
    address?: string;
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
        symbol: 'POL',
        name: 'Polygon',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832',
      },
    ],
  },
  [SupportedNetworkIds.polygon]: {
    displayName: 'Polygon (Recommended - Low Fees)',
    supportedTokens: [
      {
        symbol: 'MATIC',
        name: 'Polygon',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      },
    ],
  },
  [SupportedNetworkIds.ethereum]: {
    displayName: 'Ethereum (Higher Fees)',
    supportedTokens: [
      {
        symbol: 'ETH',
        name: 'Ether',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xa0b86a33e6d3d0b79c6930b5a95f6c21a4d4e5e3',
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      },
    ],
  },
  [SupportedNetworkIds.arbitrum]: {
    displayName: 'Arbitrum (Low Fees)',
    supportedTokens: [
      {
        symbol: 'ETH',
        name: 'Ether',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      },
      {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
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
  return config?.supportedTokens || [];
}

export function getNetworkDisplayName(networkId: SupportedNetworkIds): string {
  const config = getNetworkConfig(networkId);
  return config?.displayName || networkId;
}

export function getDefaultCurrency(networkId: SupportedNetworkIds): string {
  const config = getNetworkConfig(networkId);
  if (!config) return 'USDC';
  
  // For testnets, prefer native currency
  if (config.testnet) {
    return config.nativeCurrency.symbol;
  }
  
  // For mainnet, prefer stablecoins
  const stablecoins = ['USDC', 'USDT', 'DAI'];
  const availableStablecoin = config.supportedTokens.find(token => 
    stablecoins.includes(token.symbol)
  );
  
  return availableStablecoin?.symbol || config.nativeCurrency.symbol;
}