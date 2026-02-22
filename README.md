
# DepositLock

DepositLock is a decentralized escrow application for securely holding rental deposits with ERC-20 stablecoins.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying the Smart Contract

Create a `.env` file with:

```
POLYGON_RPC_URL=""
PRIVATE_KEY=""
CONTRACT_TOKEN_SYMBOL="USDC"
# Optional overrides:
# CONTRACT_TOKEN_ADDRESS=""
# CONTRACT_TOKEN_DECIMALS="6"
```

Deploy to Polygon mainnet:

```bash
npx hardhat run scripts/deploy-smart-contract.cjs --network polygon
```

## Interacting with the Application

1.  Connect your wallet.
2.  Create a new agreement by navigating to the `/creator` page and selecting a supported stablecoin.
3.  Deposit funds into the agreement by navigating to the `/agreement/[id]` page.
4.  Release the funds after the deadline has passed.
