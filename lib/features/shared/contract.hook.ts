import { parseEther, ethers } from 'ethers';
import { useWallet } from '../web3/wallet/wallet.hook';

// Import the artifacts directly from the compiled JSON
import EscrowArtifacts from '../../../artifacts/contracts/Escrow.sol/Escrow.json';
import { escrowABI } from '../../model/escrow.config';
import { getReadonlyProvider } from '../web3/provider/appkit.client';
import { BlockchainContract } from '@/lib/model/agreement.types';
import { getCurrencyFromNetworkId } from '../../helpers/contract.helpers';

export function useContract() {
  const wallet = useWallet();

  const createContract = async (amount: string, deadline: number, title: string, description: string, networkId: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    try {
      console.log('🚀 Starting contract deployment...');
      console.log('Amount:', amount, 'POL');
      console.log('Deadline:', new Date(deadline * 1000).toISOString());
      console.log('Title:', title);
      console.log('Description:', description);
      
      const amountInWei = parseEther(amount);
      console.log('Amount in Wei:', amountInWei.toString());
      
      // Import ContractFactory dynamically to ensure we get fresh instances
      const { ContractFactory } = await import('ethers');
      
      // Create a contract factory with the ABI and bytecode from artifacts
      const contractFactory = new ContractFactory(
        EscrowArtifacts.abi, 
        EscrowArtifacts.bytecode, 
        signer
      );
      
      // Estimate gas first to check if deployment is feasible
      console.log('📊 Estimating gas for deployment...');
      const deployTx = await contractFactory.getDeployTransaction(amountInWei, deadline, title, description, networkId);
      const gasEstimate = await signer.estimateGas(deployTx);
      console.log('Gas estimate:', gasEstimate.toString());
      
      // Check wallet balance
      const balance = await signer.provider?.getBalance(await signer.getAddress());
      console.log('Wallet balance:', balance ? ethers.formatEther(balance) : 'unknown', 'POL');
      
      // Deploy the contract with constructor parameters (amount, deadline, title, description)
      console.log('⏳ Deploying contract with gas limit:', gasEstimate.toString());
      const escrowContract = await contractFactory.deploy(amountInWei, deadline, title, description, networkId, {
        gasLimit: gasEstimate + (gasEstimate / BigInt(10)), // Add 10% buffer
      });
      
      console.log('📝 Transaction submitted, waiting for confirmation...');
      // Wait for deployment
      await escrowContract.waitForDeployment();
      
      const contractAddress = await escrowContract.getAddress();
      console.log('✅ Escrow contract deployed at:', contractAddress);
      
      // Verify the deployment by calling contract methods
      try {
        const deployedAmount = await escrowContract.getFunction('amount')();
        const deployedDeadline = await escrowContract.getFunction('deadline')();
        const deployedCreator = await escrowContract.getFunction('creator')();
        
        console.log('📋 Contract verification:');
        console.log('  - Amount:', deployedAmount.toString());
        console.log('  - Deadline:', deployedDeadline.toString());
        console.log('  - Creator:', deployedCreator);
      } catch (verificationError) {
        console.warn('⚠️ Contract verification failed (but deployment succeeded):', verificationError);
      }
      
      return contractAddress;
    } catch (error: any) {
      console.error('❌ Failed to deploy escrow contract:', error);
      
      // Provide specific error messages for common issues
      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient POL tokens in wallet to pay for gas fees. Please add more POL tokens.');
      } else if (error.message?.includes('out of gas')) {
        throw new Error('Transaction ran out of gas. This might be due to network congestion. Please try again.');
      } else if (error.message?.includes('replacement transaction underpriced')) {
        throw new Error('Transaction underpriced. Please wait a moment and try again.');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error('Could not estimate gas. Check your wallet balance and network connection.');
      } else {
        throw new Error(`Deployment failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const getContract = async (contractAddress: string): Promise<BlockchainContract> => {
    const provider = getReadonlyProvider();
    const contract = new ethers.Contract(contractAddress, escrowABI, provider);
  
    const [
      creator,
      depositor,
      amount,
      deadline,
      status,
      title,
      description,
      createdAt,
      filledAt,
      releasedAt,
      canceledAt,
      disputedAt,
      releasedAmount,
      proposedAmount,
      disputeReason,
      releaseDescription,
      cancelReason,
      networkId,
    ] = await Promise.all([
      contract.getFunction('creator')(),
      contract.getFunction('depositor')(),
      contract.getFunction('amount')(),
      contract.getFunction('deadline')(),
      contract.getFunction('status')(),
      contract.getFunction('title')(),
      contract.getFunction('description')(),
      contract.getFunction('createdAt')(),
      contract.getFunction('filledAt')(),
      contract.getFunction('releasedAt')(),
      contract.getFunction('canceledAt')(),
      contract.getFunction('disputedAt')(),
      contract.getFunction('releasedAmount')(),
      contract.getFunction('proposedAmount')(),
      contract.getFunction('disputeReason')(),
      contract.getFunction('releaseDescription')(),
      contract.getFunction('cancelReason')(),
      contract.getFunction('networkId')(),
    ]);
  
  //   const networkId = await getNetworkIdFromProvider();
  
    const formatTimestamp = (timestamp: bigint) => {
      return Number(timestamp) === 0 ? null : new Date(Number(timestamp) * 1000).toISOString();
    };

    const currency = getCurrencyFromNetworkId(networkId);
  
    return {
      contractAddress,
      creator,
      depositor,
      amount: ethers.formatEther(amount),
      currency,
      deadline: formatTimestamp(deadline)!,
      status: Number(status),
      title,
      description,
      networkId: networkId,
      discoveredAt: new Date().toISOString(),
      createdAt: formatTimestamp(createdAt),
      filledAt: formatTimestamp(filledAt),
      releasedAt: formatTimestamp(releasedAt),
      canceledAt: formatTimestamp(canceledAt),
      disputedAt: formatTimestamp(disputedAt),
      releasedAmount: Number(releasedAmount) === 0 ? null : ethers.formatEther(releasedAmount),
      proposedAmount: Number(proposedAmount) === 0 ? null : ethers.formatEther(proposedAmount),
      disputeReason: disputeReason || null,
      releaseDescription: releaseDescription || null,
      cancelReason: cancelReason || null,
    };
  }

  const cancelContract = async (contractAddress: string, reason: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    
    const tx = await escrowContract.getFunction('cancel')(reason);
    await tx.wait();
    
    return tx;
  };

  const fillContract = async (contractAddress: string, amount: string) => {
    const signer = await wallet.getSigner();
    if (!signer) return;
    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const amountInWei = ethers.parseEther(amount);
    const tx = await escrowContract.getFunction('deposit')({ value: amountInWei });
    console.log('📝 Transaction submitted, waiting for confirmation...');
    await tx.wait();
  };

  const openDispute = async (contractAddress: string, reason: string, proposedAmount: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const proposedAmountInWei = ethers.parseEther(proposedAmount);
    
    const tx = await escrowContract.getFunction('openDispute')(reason, proposedAmountInWei);
    await tx.wait();
    
    return tx;
  };

  const resolveDispute = async (contractAddress: string, releaseAmount: string, description: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const releaseAmountInWei = ethers.parseEther(releaseAmount);
    
    const tx = await escrowContract.getFunction('resolveDispute')(releaseAmountInWei, description);
    await tx.wait();
    
    return tx;
  };

  const releaseFunds = async (contractAddress: string, releaseAmount: string, description: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const releaseAmountInWei = ethers.parseEther(releaseAmount);
    
    const tx = await escrowContract.getFunction('release')(releaseAmountInWei, description);
    await tx.wait();
    
    return tx;
  };

  const emergencyRelease = async (contractAddress: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    
    const tx = await escrowContract.getFunction('emergencyRelease')();
    await tx.wait();
    
    return tx;
  };


  return { createContract, getContract, cancelContract, fillContract, openDispute, resolveDispute, releaseFunds, emergencyRelease };
}