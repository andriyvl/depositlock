import { ethers } from 'ethers';
import { useWallet } from '../web3/wallet/wallet.hook';

// Import the artifacts directly from the compiled JSON
import EscrowArtifacts from '../../../artifacts/contracts/Escrow.sol/Escrow.json';
import { escrowABI } from '../../model/escrow.config';
import { getReadonlyProvider } from '../web3/provider/appkit.client';
import { BlockchainContract } from '@/lib/model/agreement.types';
import { getTokenConfig, SupportedNetworkIds } from '../../model/network.config';

const erc20Abi = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export function useContract() {
  const wallet = useWallet();

  const parseAmountForContract = async (contractAddress: string, humanAmount: string, signer: ethers.Signer): Promise<bigint> => {
    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const tokenDecimals = Number(await escrowContract.getFunction('tokenDecimals')());
    return ethers.parseUnits(humanAmount, tokenDecimals);
  };

  const createContract = async (
    amount: string,
    deadline: number,
    title: string,
    description: string,
    networkId: SupportedNetworkIds,
    currency: string
  ) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const tokenConfig = getTokenConfig(networkId, currency);
    if (!tokenConfig) {
      throw new Error(`Unsupported token ${currency} for ${networkId}`);
    }

    try {
      const amountInTokenUnits = ethers.parseUnits(amount, tokenConfig.decimals);

      // Import ContractFactory dynamically to ensure we get fresh instances
      const { ContractFactory } = await import('ethers');

      // Create a contract factory with the ABI and bytecode from artifacts
      const contractFactory = new ContractFactory(
        EscrowArtifacts.abi,
        EscrowArtifacts.bytecode,
        signer
      );

      // Estimate gas first to check if deployment is feasible
      const deployTx = await contractFactory.getDeployTransaction(
        amountInTokenUnits,
        deadline,
        title,
        description,
        networkId,
        tokenConfig.address,
        tokenConfig.symbol,
        tokenConfig.decimals
      );
      const gasEstimate = await signer.estimateGas(deployTx);

      // Deploy the contract with constructor parameters
      const escrowContract = await contractFactory.deploy(
        amountInTokenUnits,
        deadline,
        title,
        description,
        networkId,
        tokenConfig.address,
        tokenConfig.symbol,
        tokenConfig.decimals,
        {
          gasLimit: gasEstimate + gasEstimate / BigInt(10), // Add 10% buffer
        }
      );

      await escrowContract.waitForDeployment();
      return await escrowContract.getAddress();
    } catch (error: any) {
      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient POL balance to pay gas fees.');
      } else if (error.message?.includes('out of gas')) {
        throw new Error('Transaction ran out of gas. Please try again.');
      } else if (error.message?.includes('replacement transaction underpriced')) {
        throw new Error('Transaction underpriced. Please wait and retry.');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error('Could not estimate gas. Check wallet/network and token settings.');
      } else {
        throw new Error(`Deployment failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const getContract = async (
    contractAddress: string,
    networkId: SupportedNetworkIds = SupportedNetworkIds.polygon
  ): Promise<BlockchainContract> => {
    const provider = getReadonlyProvider(networkId);
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
      contractNetworkId,
      tokenAddress,
      tokenSymbol,
      tokenDecimals,
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
      contract.getFunction('tokenAddress')(),
      contract.getFunction('tokenSymbol')(),
      contract.getFunction('tokenDecimals')(),
    ]);

    const tokenDecimalsNumber = Number(tokenDecimals);

    const formatTimestamp = (timestamp: bigint) => {
      return Number(timestamp) === 0 ? null : new Date(Number(timestamp) * 1000).toISOString();
    };

    const resolvedNetworkId =
      (contractNetworkId as SupportedNetworkIds) || networkId;

    return {
      contractAddress,
      creator,
      depositor,
      amount: ethers.formatUnits(amount, tokenDecimalsNumber),
      currency: tokenSymbol,
      tokenAddress,
      tokenSymbol,
      tokenDecimals: tokenDecimalsNumber,
      deadline: formatTimestamp(deadline)!,
      status: Number(status),
      title,
      description,
      networkId: resolvedNetworkId,
      discoveredAt: new Date().toISOString(),
      createdAt: formatTimestamp(createdAt),
      filledAt: formatTimestamp(filledAt),
      releasedAt: formatTimestamp(releasedAt),
      canceledAt: formatTimestamp(canceledAt),
      disputedAt: formatTimestamp(disputedAt),
      releasedAmount:
        releasedAmount === 0n ? null : ethers.formatUnits(releasedAmount, tokenDecimalsNumber),
      proposedAmount:
        proposedAmount === 0n ? null : ethers.formatUnits(proposedAmount, tokenDecimalsNumber),
      disputeReason: disputeReason || null,
      releaseDescription: releaseDescription || null,
      cancelReason: cancelReason || null,
    };
  };

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

  const fillContract = async (contractAddress: string, _amount?: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const [requiredAmount, tokenAddress, depositorAddress] = await Promise.all([
      escrowContract.getFunction('amount')(),
      escrowContract.getFunction('tokenAddress')(),
      signer.getAddress(),
    ]);

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const allowance = await tokenContract.getFunction('allowance')(depositorAddress, contractAddress);

    if (allowance < requiredAmount) {
      const approveTx = await tokenContract.getFunction('approve')(contractAddress, requiredAmount);
      await approveTx.wait();
    }

    const tx = await escrowContract.getFunction('deposit')();
    await tx.wait();
    return tx;
  };

  const openDispute = async (contractAddress: string, reason: string, proposedAmount: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const proposedAmountInUnits = await parseAmountForContract(contractAddress, proposedAmount, signer);

    const tx = await escrowContract.getFunction('openDispute')(reason, proposedAmountInUnits);
    await tx.wait();

    return tx;
  };

  const resolveDispute = async (contractAddress: string, releaseAmount: string, description: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const releaseAmountInUnits = await parseAmountForContract(contractAddress, releaseAmount, signer);

    const tx = await escrowContract.getFunction('resolveDispute')(releaseAmountInUnits, description);
    await tx.wait();

    return tx;
  };

  const releaseFunds = async (contractAddress: string, releaseAmount: string, description: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const releaseAmountInUnits = await parseAmountForContract(contractAddress, releaseAmount, signer);

    const tx = await escrowContract.getFunction('release')(releaseAmountInUnits, description);
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
