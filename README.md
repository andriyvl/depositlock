
# DepositLock

This is a decentralized escrow application for securely holding rental deposits.

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

To deploy the smart contract, you will need to create a `.env` with the following environment variables:

```
AMOY_RPC_URL=""
PRIVATE_KEY=""
```

Then, run the deployment script:

```bash
npx hardhat run scripts/deploy.cjs --network amoy
```

## Interacting with the Application

1.  Connect your wallet.
2.  Create a new agreement by navigating to the `/create` page.
3.  Deposit funds into the agreement by navigating to the `/agreement/[id]` page.
4.  Release the funds after the deadline has passed.
