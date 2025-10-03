import { Agreement, AGREEMENT_STATUS, BlockchainContract, UserDatabaseContract } from "@/lib/model/agreement.types";
import { ethers } from 'ethers';
import { writeToClipboard } from "@/lib/helpers/clipboard.helpers";
import { showToast } from "@/lib/features/shared/components/show-toast";
import { getReadonlyProvider } from '@/lib/features/web3/provider/appkit.client';
import { escrowABI } from '@/lib/model/escrow.config';
import { getNetworkFromChainId } from "@/lib/helpers/network.helpers";
import { getDefaultCurrency, SupportedNetworkIds } from '@/lib/model/network.config';

/**
 * Helper function to copy an address to clipboard with toast notifications
 * @param address - The address to copy
 * @param type - The type of address for the toast message (e.g., "Address", "Contract address")
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyAddressToClipboard(
  address: string, 
  type: string = "Address"
): Promise<boolean> {
  if (!address) {
    showToast(`No ${type.toLowerCase()} to copy`, "error");
    return false;
  }
  
  const success = await writeToClipboard(address);
  if (success) {
    showToast(`${type} copied to clipboard!`, "success");
  } else {
    showToast(`Failed to copy ${type.toLowerCase()}`, "error");
  }
  
  return success;
}

/**
 * Helper function specifically for copying wallet addresses
 * @param address - The wallet address to copy
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyWalletAddress(address: string): Promise<boolean> {
  return copyAddressToClipboard(address, "Address");
}

/**
 * Helper function specifically for copying contract addresses
 * @param contractAddress - The contract address to copy
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyContractAddress(contractAddress: string): Promise<boolean> {
  return copyAddressToClipboard(contractAddress, "Contract address");
}

/**
 * Helper function for copying contract links
 * @param contractAddress - The contract address to create a link for
 * @param baseUrl - The base URL (defaults to current window location)
 * @returns Promise<boolean> - Whether the copy was successful
 */
export async function copyContractLink(
  contractAddress: string, 
  baseUrl?: string
): Promise<boolean> {
  if (!contractAddress) {
    showToast("No contract address to create link", "error");
    return false;
  }
  
  const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const link = `${url}/contract/${contractAddress}`;
  
  const success = await writeToClipboard(link);
  if (success) {
    showToast("Contract link copied to clipboard!", "success");
  } else {
    showToast("Failed to copy contract link", "error");
  }
  
  return success;
}

/**
 * Checks if an address is the zero address
 * @param address - The address to check
 * @returns True if it's the zero address
 */
export function isZeroAddress(address: string): boolean {
    const validAddress = validateAndChecksumAddress(address);
    return validAddress === ethers.ZeroAddress;
  }

export function mapToAgreement(
    dbContract: UserDatabaseContract,
    blockchainContract: BlockchainContract,
    currentUserAddress?: string
): Agreement {

    const {
        contractAddress,
        role,
    } = dbContract;

    const {
        creator,
        depositor,
        status,
        networkId,
    } = blockchainContract;

    let counterparty = 'No depositor yet';
    if (currentUserAddress) {
        const userAddressLower = currentUserAddress.toLowerCase();
        if (role === 'creator') {
            counterparty = !isZeroAddress(depositor) ? depositor : 'No depositor yet';
        } else if (role === 'depositor') {
            counterparty = creator;
        }
    }

    return {
        ...blockchainContract,
        id: contractAddress,
        contractAddress,
        statusName: AGREEMENT_STATUS[status],
        networkName: getNetworkFromChainId(Number(networkId)),
        role,
        counterparty,
        createdAt: dbContract.createdAt,
    };
}

export const getStatusString = (statusNum: number) => {
    switch (statusNum) {
        case 0: return 'pending';
        case 1: return 'filled';
        case 2: return 'released';
        case 3: return 'disputed';
        case 4: return 'canceled';
        default: return 'pending';
    }
};



/**
 * Validates and checksums an Ethereum address
 * @param address - The address to validate
 * @returns The checksummed address or null if invalid
 */
export function validateAndChecksumAddress(address: string): string | null {
  try {
    if (!address || typeof address !== 'string') {
      return null;
    }
    
    // Remove any whitespace
    const cleanAddress = address.trim();
    
    // Check if it's a valid Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanAddress)) {
      return null;
    }
    
    // Convert to lowercase first to avoid checksum issues, then get proper checksum
    const lowercaseAddress = cleanAddress.toLowerCase();
    return ethers.getAddress(lowercaseAddress);
  } catch (error) {
    // Only log for truly invalid addresses, not checksum issues
    console.warn('Invalid address format:', address);
    return null;
  }
}

/**
 * Checks if an address is valid
 * @param address - The address to check
 * @returns True if valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  return validateAndChecksumAddress(address) !== null;
}

/**
 * Formats an address for display (shortened with ellipsis)
 * @param address - The address to format
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Formatted address or empty string if invalid
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  const validAddress = validateAndChecksumAddress(address);
  if (!validAddress || validAddress.length < startChars + endChars) {
    return '';
  }
  
  return `${validAddress.slice(0, startChars)}...${validAddress.slice(-endChars)}`;
}



export async function verifyUserRole(contractAddress: string, userAddress: string): Promise<'creator' | 'depositor' | null> {
    const provider = getReadonlyProvider();
    const contract = new ethers.Contract(contractAddress, escrowABI, provider);

    const [creator, depositor] = await Promise.all([
        contract.getFunction('creator')(),
        contract.getFunction('depositor')(),
    ]);

    const creatorAddr = creator.toLowerCase();
    const depositorAddr = depositor.toLowerCase();
    const userAddr = userAddress.toLowerCase();

    if (creatorAddr === userAddr) {
        return 'creator';
    } else if (depositorAddr === userAddr || isZeroAddress(depositorAddr)) {
        return 'depositor';
    }

    return null;
}

export function getCurrencyFromNetworkId(networkId: string): string {
  const supportedNetworkId = Object.values(SupportedNetworkIds).find(id => id === networkId);
  
  if (supportedNetworkId) {
    return getDefaultCurrency(supportedNetworkId);
  }
  
  // Fallback for unknown network IDs
  return 'USD';
}