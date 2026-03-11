import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useWallet } from '../web3/wallet/wallet.hook';

// Import the artifacts directly from the compiled JSON
import EscrowArtifacts from '../../../artifacts/contracts/Escrow.sol/Escrow.json';
import { escrowABI } from '../../model/escrow.config';
import { getReadonlyProvider } from '../web3/provider/appkit.client';
import { BlockchainContract } from '@/lib/model/agreement.types';
import { DEPLOYMENT_NETWORKS, getNetworkConfig, getTokenConfig, SupportedNetworkIds } from '../../model/network.config';

const erc20Abi = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

const opGasPriceOracleAbi = [
  'function getL1Fee(bytes memory data) view returns (uint256)',
];

const OP_STACK_GAS_PRICE_ORACLE = '0x420000000000000000000000000000000000000F';

type DeploymentCostEstimate = {
  gasLimit: string;
  gasPriceGwei: string;
  l1DataFeeNative: string;
  totalFeeNative: string;
  nativeSymbol: string;
};

type DepositApprovalState = {
  allowance: bigint;
  balance: bigint;
  requiredAmount: bigint;
  tokenAddress: string;
  tokenSymbol: string;
  hasEnoughBalance: boolean;
  isApproved: boolean;
};

const READ_TIMEOUT_MS = 4000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs = READ_TIMEOUT_MS): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
    }),
  ]);
}

export function useContract() {
  const wallet = useWallet();

  const resolveContractNetwork = useCallback(async (
    contractAddress: string,
    preferredNetworkId?: SupportedNetworkIds
  ): Promise<SupportedNetworkIds> => {
    const candidates = [
      preferredNetworkId,
      ...DEPLOYMENT_NETWORKS,
      SupportedNetworkIds.polygonAmoy,
    ].filter(Boolean) as SupportedNetworkIds[];

    const seen = new Set<string>();
    const uniqueCandidates = candidates.filter((candidate) => {
      if (seen.has(candidate)) return false;
      seen.add(candidate);
      return true;
    });

    const probeResults = await Promise.all(
      uniqueCandidates.map(async (networkId) => {
        try {
          const provider = getReadonlyProvider(networkId);
          const code = await withTimeout(provider.getCode(contractAddress));
          return { networkId, hasCode: Boolean(code && code !== '0x') };
        } catch {
          return { networkId, hasCode: false };
        }
      })
    );

    const matchedNetwork = probeResults.find((result) => result.hasCode)?.networkId;
    if (matchedNetwork) {
      return matchedNetwork;
    }

    return preferredNetworkId || SupportedNetworkIds.polygon;
  }, []);

  const getDeploymentRequest = async (
    amount: string,
    deadline: number,
    title: string,
    description: string,
    networkId: SupportedNetworkIds,
    currency: string
  ) => {
    const tokenConfig = getTokenConfig(networkId, currency);
    if (!tokenConfig) {
      throw new Error(`Unsupported token ${currency} for ${networkId}`);
    }

    const amountInTokenUnits = ethers.parseUnits(amount, tokenConfig.decimals);
    const { ContractFactory } = await import('ethers');

    const contractFactory = new ContractFactory(
      EscrowArtifacts.abi,
      EscrowArtifacts.bytecode
    );

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

    return { deployTx, tokenConfig, amountInTokenUnits };
  };

  const estimateL1DataFeeForOpStack = async (
    networkId: SupportedNetworkIds,
    deployTxData: string,
    gasLimit: bigint,
    maxFeePerGas: bigint,
    maxPriorityFeePerGas: bigint
  ): Promise<bigint> => {
    if (![SupportedNetworkIds.optimism, SupportedNetworkIds.base].includes(networkId)) {
      return 0n;
    }

    const provider = getReadonlyProvider(networkId);
    const chain = await provider.getNetwork();
    const tx = ethers.Transaction.from({
      type: 2,
      chainId: Number(chain.chainId),
      nonce: 0,
      gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      to: null,
      value: 0,
      data: deployTxData,
    });

    const gasOracle = new ethers.Contract(
      OP_STACK_GAS_PRICE_ORACLE,
      opGasPriceOracleAbi,
      provider
    );

    try {
      return await gasOracle.getFunction('getL1Fee')(tx.unsignedSerialized);
    } catch (error) {
      console.warn('Failed to fetch OP Stack L1 data fee, using execution fee only.', error);
      return 0n;
    }
  };

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

    try {
      const { deployTx } = await getDeploymentRequest(
        amount,
        deadline,
        title,
        description,
        networkId,
        currency
      );

      const from = await signer.getAddress();
      const gasEstimate = await signer.estimateGas({
        ...deployTx,
        from,
      });

      const tx = await signer.sendTransaction({
        ...deployTx,
        from,
        gasLimit: gasEstimate + gasEstimate / BigInt(10), // Add 10% buffer
      });

      const receipt = await tx.wait();
      if (!receipt?.contractAddress) {
        throw new Error('Contract deployment transaction confirmed without contract address.');
      }

      return receipt.contractAddress;
    } catch (error: any) {
      const nativeSymbol = getNetworkConfig(networkId)?.nativeCurrency.symbol || 'native token';

      if (error.message?.includes('insufficient funds')) {
        throw new Error(`Insufficient ${nativeSymbol} balance to pay gas fees.`);
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

  const estimateDeploymentCost = async (
    amount: string,
    deadline: number,
    title: string,
    description: string,
    networkId: SupportedNetworkIds,
    currency: string
  ): Promise<DeploymentCostEstimate> => {
    const provider = getReadonlyProvider(networkId);
    const from = wallet.address || ethers.ZeroAddress;
    const { deployTx } = await getDeploymentRequest(
      amount,
      deadline,
      title,
      description,
      networkId,
      currency
    );

    const gasLimit = await provider.estimateGas({
      ...deployTx,
      from,
    });

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;
    if (!gasPrice) {
      throw new Error('Unable to fetch current gas price for selected network.');
    }

    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || 0n;
    const executionFee = gasLimit * gasPrice;
    const l1DataFee = await estimateL1DataFeeForOpStack(
      networkId,
      (deployTx.data as string) || '0x',
      gasLimit,
      gasPrice,
      maxPriorityFeePerGas
    );

    const totalFee = executionFee + l1DataFee;
    const nativeSymbol = getNetworkConfig(networkId)?.nativeCurrency.symbol || 'ETH';

    return {
      gasLimit: gasLimit.toString(),
      gasPriceGwei: ethers.formatUnits(gasPrice, 'gwei'),
      l1DataFeeNative: ethers.formatEther(l1DataFee),
      totalFeeNative: ethers.formatEther(totalFee),
      nativeSymbol,
    };
  };

  const getContract = useCallback(async (
    contractAddress: string,
    networkId: SupportedNetworkIds = SupportedNetworkIds.polygon
  ): Promise<BlockchainContract> => {
    const resolvedReadNetworkId = await resolveContractNetwork(contractAddress, networkId);
    const provider = getReadonlyProvider(resolvedReadNetworkId);
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
    ] = await withTimeout(Promise.all([
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
    ]), 6000);

    const tokenDecimalsNumber = Number(tokenDecimals);

    const formatTimestamp = (timestamp: bigint) => {
      return Number(timestamp) === 0 ? null : new Date(Number(timestamp) * 1000).toISOString();
    };

    const resolvedNetworkId =
      (contractNetworkId as SupportedNetworkIds) || resolvedReadNetworkId;

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
  }, [resolveContractNetwork]);

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

  const getDepositApprovalState = async (contractAddress: string): Promise<DepositApprovalState> => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);
    const [requiredAmount, tokenAddress, tokenSymbol, depositorAddress] = await Promise.all([
      escrowContract.getFunction('amount')(),
      escrowContract.getFunction('tokenAddress')(),
      escrowContract.getFunction('tokenSymbol')(),
      signer.getAddress(),
    ]);

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    const [allowance, balance] = await Promise.all([
      tokenContract.getFunction('allowance')(depositorAddress, contractAddress),
      tokenContract.getFunction('balanceOf')(depositorAddress),
    ]);

    return {
      allowance,
      balance,
      requiredAmount,
      tokenAddress,
      tokenSymbol,
      hasEnoughBalance: balance >= requiredAmount,
      isApproved: allowance >= requiredAmount,
    };
  };

  const approveDeposit = async (contractAddress: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const approvalState = await getDepositApprovalState(contractAddress);
    if (approvalState.isApproved) {
      return null;
    }

    const tokenContract = new ethers.Contract(approvalState.tokenAddress, erc20Abi, signer);
    const approveTx = await tokenContract.getFunction('approve')(contractAddress, approvalState.requiredAmount);
    await approveTx.wait();

    return approveTx;
  };

  const fillContract = async (contractAddress: string) => {
    const signer = await wallet.getSigner();
    if (!signer) {
      throw new Error('No signer available');
    }

    const approvalState = await getDepositApprovalState(contractAddress);
    if (!approvalState.isApproved) {
      throw new Error(`Approve ${approvalState.tokenSymbol} before depositing.`);
    }
    if (!approvalState.hasEnoughBalance) {
      throw new Error(`Insufficient ${approvalState.tokenSymbol} balance to deposit.`);
    }

    const escrowContract = new ethers.Contract(contractAddress, escrowABI, signer);

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

  return {
    createContract,
    estimateDeploymentCost,
    getContract,
    getDepositApprovalState,
    approveDeposit,
    cancelContract,
    fillContract,
    openDispute,
    resolveDispute,
    releaseFunds,
    emergencyRelease,
  };
}
