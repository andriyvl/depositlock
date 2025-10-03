const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("🚀 Deploying DepositLock Escrow Contract");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("Deployer:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "ETH");

  // Environment-specific configurations
  const configs = {
    // Polygon Amoy Testnet
    80002: {
      name: "Polygon Amoy Testnet",
      currency: "POL",
      defaultAmount: "0.1",
      defaultDeadlineHours: 24,
      explorer: "https://www.oklink.com/amoy"
    },
    // Polygon Mainnet (when ready)
    /* 137: {
      name: "Polygon Mainnet",
      currency: "MATIC",
      defaultAmount: "10",
      defaultDeadlineHours: 168, // 1 week
      explorer: "https://polygonscan.com"
    }, */
    // Ethereum Sepolia Testnet
    /* 11155111: {
      name: "Ethereum Sepolia Testnet",
      currency: "ETH",
      defaultAmount: "0.01",
      defaultDeadlineHours: 24,
      explorer: "https://sepolia.etherscan.io"
    } */
  };

  const config = configs[network.chainId] || {
    name: "Unknown Network",
    currency: "ETH",
    defaultAmount: "0.1",
    defaultDeadlineHours: 24,
    explorer: "Unknown"
  };

  console.log(`\n🌐 Network: ${config.name}`);
  console.log(`💱 Currency: ${config.currency}`);
  console.log(`🔗 Explorer: ${config.explorer}`);

  // Deployment parameters (can be overridden by environment variables)
  const deploymentConfig = {
    amount: process.env.CONTRACT_AMOUNT || config.defaultAmount,
    deadlineHours: parseInt(process.env.CONTRACT_DEADLINE_HOURS) || config.defaultDeadlineHours,
    title: process.env.CONTRACT_TITLE || "Deposit Agreement",
    description: process.env.CONTRACT_DESCRIPTION || "Secure deposit agreement created via DepositLock",
    networkId: 'eip155:80002'
  };

  console.log("\n📋 Deployment Configuration:");
  console.log("Amount:", deploymentConfig.amount, config.currency);
  console.log("Deadline:", deploymentConfig.deadlineHours, "hours from now");
  console.log("Title:", deploymentConfig.title);
  console.log("Description:", deploymentConfig.description);
  console.log("Network ID:", deploymentConfig.networkId);

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
      ethers.parseEther(deploymentConfig.amount),
      Math.floor(Date.now() / 1000) + (deploymentConfig.deadlineHours * 3600),
      deploymentConfig.title,
      deploymentConfig.description,
      deploymentConfig.networkId
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
      
      console.log("Contract Verification:");
      console.log("  - Amount:", ethers.formatEther(deployedAmount), config.currency);
      console.log("  - Deadline:", new Date(Number(deployedDeadline) * 1000).toISOString());
      console.log("  - Creator:", deployedCreator);
      console.log("  - Title:", deployedTitle);
      console.log("  - Description:", deployedDescription);
      console.log("  - Network ID:", deployedNetworkId);
      
      console.log("\n🎯 Contract is ready for use!");
      console.log("Contract URL:", `${config.explorer}/address/${contractAddress}`);
      
      // Save deployment info to file
      const deploymentInfo = {
        network: config.name,
        chainId: Number(network.chainId), // Convert BigInt to Number
        contractAddress: contractAddress,
        transactionHash: escrow.deploymentTransaction().hash,
        blockNumber: escrow.deploymentTransaction().blockNumber ? Number(escrow.deploymentTransaction().blockNumber) : null, // Convert BigInt to Number
        deployer: deployer.address,
        amount: deploymentConfig.amount,
        currency: config.currency,
        deadline: deploymentConfig.deadlineHours,
        title: deploymentConfig.title,
        description: deploymentConfig.description,
        networkId: deploymentConfig.networkId,
        deployedAt: new Date().toISOString(),
        explorer: config.explorer
      };

      const fs = require('fs');
      const deploymentFile = `deployment-${network.chainId}-${Date.now()}.json`;
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