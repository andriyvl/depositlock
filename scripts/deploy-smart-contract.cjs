const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("🚀 Deploying DepositLock Escrow Contract");
  console.log("Network:", network.name);
  console.log("Chain ID:", chainId);
  console.log("Deployer:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "native");

  // Environment-specific configurations
  const configs = {
    // Ethereum Mainnet
    1: {
      name: "Ethereum Mainnet",
      currency: "ETH",
      defaultAmount: "100",
      defaultDeadlineHours: 168, // 7 days
      explorer: "https://etherscan.io",
      networkId: "eip155:1",
    },
    // Polygon Mainnet
    137: {
      name: "Polygon Mainnet",
      currency: "POL",
      defaultAmount: "100",
      defaultDeadlineHours: 168, // 7 days
      explorer: "https://polygonscan.com",
      networkId: "eip155:137",
    },
    // Polygon Amoy Testnet
    80002: {
      name: "Polygon Amoy Testnet",
      currency: "POL",
      defaultAmount: "10",
      defaultDeadlineHours: 24,
      explorer: "https://www.oklink.com/amoy",
      networkId: "eip155:80002",
    },
    // Arbitrum One
    42161: {
      name: "Arbitrum One",
      currency: "ETH",
      defaultAmount: "100",
      defaultDeadlineHours: 168,
      explorer: "https://arbiscan.io",
      networkId: "eip155:42161",
    },
    // Optimism Mainnet
    10: {
      name: "Optimism Mainnet",
      currency: "ETH",
      defaultAmount: "100",
      defaultDeadlineHours: 168,
      explorer: "https://optimistic.etherscan.io",
      networkId: "eip155:10",
    },
    // Base Mainnet
    8453: {
      name: "Base Mainnet",
      currency: "ETH",
      defaultAmount: "100",
      defaultDeadlineHours: 168,
      explorer: "https://basescan.org",
      networkId: "eip155:8453",
    },
    5000: {
      name: "Mantle Mainnet",
      currency: "MNT",
      defaultAmount: "100",
      defaultDeadlineHours: 168,
      explorer: "https://mantlescan.xyz",
      networkId: "eip155:5000",
    },
  };

  const tokenConfigs = {
    137: {
      USDC: {
        address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        decimals: 6,
      },
      USDT: {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimals: 6,
      },
    },
    80002: {
      USDC: {
        address: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        decimals: 6,
      },
      USDT: {
        address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
        decimals: 6,
      },
    },
    1: {
      USDC: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
      USDT: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
      },
    },
    42161: {
      USDC: {
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        decimals: 6,
      },
      USDT: {
        address: "0xFd086bC7CD5C481DCC9C85ebe478A1C0b69FCbb9",
        decimals: 6,
      },
    },
    10: {
      USDC: {
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        decimals: 6,
      },
      USDT: {
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        decimals: 6,
      },
    },
    8453: {
      USDC: {
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
      },
      USDT: {
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        decimals: 6,
      },
    },
    5000: {
      USDC: {
        address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
        decimals: 6,
      },
    },
  };

  const config = configs[chainId] || {
    name: "Unknown Network",
    currency: "ETH",
    defaultAmount: "100",
    defaultDeadlineHours: 24,
    explorer: "Unknown",
    networkId: `eip155:${chainId}`,
  };

  const selectedTokenSymbol = (process.env.CONTRACT_TOKEN_SYMBOL || "USDC").toUpperCase();
  const chainTokens = tokenConfigs[chainId] || {};
  const selectedToken = chainTokens[selectedTokenSymbol];

  const tokenAddress = process.env.CONTRACT_TOKEN_ADDRESS || selectedToken?.address;
  const tokenDecimals = Number.parseInt(
    process.env.CONTRACT_TOKEN_DECIMALS || String(selectedToken?.decimals || 6),
    10
  );

  if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
    throw new Error(
      `Invalid token configuration. Set CONTRACT_TOKEN_ADDRESS or choose a supported token for chain ${chainId}.`
    );
  }

  console.log(`\n🌐 Network: ${config.name}`);
  console.log(`💱 Gas Currency: ${config.currency}`);
  console.log(`🔗 Explorer: ${config.explorer}`);

  // Deployment parameters (can be overridden by environment variables)
  const deploymentConfig = {
    amount: process.env.CONTRACT_AMOUNT || config.defaultAmount,
    deadlineHours: Number.parseInt(process.env.CONTRACT_DEADLINE_HOURS || "", 10) || config.defaultDeadlineHours,
    title: process.env.CONTRACT_TITLE || "Deposit Agreement",
    description: process.env.CONTRACT_DESCRIPTION || "Secure deposit agreement created via DepositLock",
    networkId: process.env.CONTRACT_NETWORK_ID || config.networkId,
    tokenAddress,
    tokenSymbol: selectedTokenSymbol,
    tokenDecimals,
  };

  console.log("\n📋 Deployment Configuration:");
  console.log("Amount:", deploymentConfig.amount, deploymentConfig.tokenSymbol);
  console.log("Deadline:", deploymentConfig.deadlineHours, "hours from now");
  console.log("Title:", deploymentConfig.title);
  console.log("Description:", deploymentConfig.description);
  console.log("Network ID:", deploymentConfig.networkId);
  console.log("Token Address:", deploymentConfig.tokenAddress);
  console.log("Token Decimals:", deploymentConfig.tokenDecimals);

  // Validate configuration
  if (parseFloat(deploymentConfig.amount) <= 0) {
    throw new Error("Contract amount must be greater than 0");
  }

  if (deploymentConfig.deadlineHours <= 0) {
    throw new Error("Contract deadline must be greater than 0");
  }

  try {
    // Deploy the contract
    console.log("\n⏳ Deploying contract...");
    const Escrow = await ethers.getContractFactory("Escrow");
    
    const escrow = await Escrow.deploy(
      ethers.parseUnits(deploymentConfig.amount, deploymentConfig.tokenDecimals),
      Math.floor(Date.now() / 1000) + (deploymentConfig.deadlineHours * 3600),
      deploymentConfig.title,
      deploymentConfig.description,
      deploymentConfig.networkId,
      deploymentConfig.tokenAddress,
      deploymentConfig.tokenSymbol,
      deploymentConfig.tokenDecimals
    );

    console.log("📝 Transaction submitted, waiting for confirmation...");
    await escrow.waitForDeployment();

    const contractAddress = await escrow.getAddress();
    
    console.log("\n✅ Contract Deployed Successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("Transaction Hash:", escrow.deploymentTransaction().hash);
    console.log("Block Number:", escrow.deploymentTransaction().blockNumber);
    
    // Verify deployment by calling contract methods
    console.log("\n🔍 Verifying deployment...");
    try {
      const deployedAmount = await escrow.getFunction('amount')();
      const deployedDeadline = await escrow.getFunction('deadline')();
      const deployedCreator = await escrow.getFunction('creator')();
      const deployedTitle = await escrow.getFunction('title')();
      const deployedDescription = await escrow.getFunction('description')();
      const deployedNetworkId = await escrow.getFunction('networkId')();
      const deployedTokenAddress = await escrow.getFunction('tokenAddress')();
      const deployedTokenSymbol = await escrow.getFunction('tokenSymbol')();
      const deployedTokenDecimals = await escrow.getFunction('tokenDecimals')();
      
      console.log("Contract Verification:");
      console.log("  - Amount:", ethers.formatUnits(deployedAmount, Number(deployedTokenDecimals)), deployedTokenSymbol);
      console.log("  - Deadline:", new Date(Number(deployedDeadline) * 1000).toISOString());
      console.log("  - Creator:", deployedCreator);
      console.log("  - Title:", deployedTitle);
      console.log("  - Description:", deployedDescription);
      console.log("  - Network ID:", deployedNetworkId);
      console.log("  - Token Address:", deployedTokenAddress);
      console.log("  - Token Decimals:", Number(deployedTokenDecimals));
      
      console.log("\n🎯 Contract is ready for use!");
      console.log("Contract URL:", `${config.explorer}/address/${contractAddress}`);
      
      // Save deployment info to file
      const deploymentInfo = {
        network: config.name,
        chainId,
        contractAddress: contractAddress,
        transactionHash: escrow.deploymentTransaction().hash,
        blockNumber: escrow.deploymentTransaction().blockNumber ? Number(escrow.deploymentTransaction().blockNumber) : null,
        deployer: deployer.address,
        amount: deploymentConfig.amount,
        currency: deploymentConfig.tokenSymbol,
        tokenAddress: deploymentConfig.tokenAddress,
        tokenDecimals: deploymentConfig.tokenDecimals,
        deadline: deploymentConfig.deadlineHours,
        title: deploymentConfig.title,
        description: deploymentConfig.description,
        networkId: deploymentConfig.networkId,
        deployedAt: new Date().toISOString(),
        explorer: config.explorer
      };

      const fs = require('fs');
      const deploymentFile = `deployment-${chainId}-${Date.now()}.json`;
      fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
      console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
      
    } catch (verificationError) {
      console.warn("⚠️ Contract verification failed (but deployment succeeded):", verificationError.message);
    }

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 
