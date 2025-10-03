

import { mapToAgreement, verifyUserRole } from '@/lib/helpers/contract.helpers';
import { User, UserDatabaseContract } from '@/lib/model/agreement.types';
import { getContracts } from './db-contracts/contracts.actions';
import { useAppStore } from '../store/app.store';
import { useContract } from './contract.hook';

export function useAgreement(contractAddress: string, user: User) {
  const { getContract } = useContract();

  const { setCurrentAgreement, setCurrentAgreementLoading, setCurrentAgreementError } = useAppStore();


  async function fetchAgreement() {
    if (!contractAddress) {
      setCurrentAgreement(null);
      setCurrentAgreementLoading(false);
      return;
    }

    setCurrentAgreementLoading(true);
    setCurrentAgreementError(null);
    setCurrentAgreement(null);

    try {
      const blockchainContract = await getContract(contractAddress);
      
      let userDbContract: UserDatabaseContract | undefined;
      if (user?.address) {
          const dbContracts = await getContracts(user.address);
          userDbContract = dbContracts.find(c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase());
      }

      if (!userDbContract) {
          let role: 'creator' | 'depositor' | null = null;
          if (user?.address) {
              role = await verifyUserRole(contractAddress, user.address);
          }

          userDbContract = {
              contractAddress: contractAddress,
              role: role || 'creator',
              createdAt: blockchainContract.createdAt || new Date().toISOString(),
              networkId: blockchainContract.networkId!
          };
      }
      
      const fullAgreement = mapToAgreement(userDbContract, blockchainContract, user?.address);
      setCurrentAgreement(fullAgreement);

    } catch (e) {
      console.error(`Failed to fetch agreement data for ${contractAddress}`, e);
      setCurrentAgreementError("Failed to load agreement details.");
      setCurrentAgreement(null);
    } finally {
      setCurrentAgreementLoading(false);
    }
  }

  return { fetchAgreement };
}