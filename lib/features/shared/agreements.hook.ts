import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/auth.hook';
import { useAppStore } from '../store/app.store';
import { getContracts } from './db-contracts/contracts.actions';
import { mapToAgreement } from '@/lib/helpers/contract.helpers';
import { useContract } from './contract.hook';
import { User } from '@/lib/model/agreement.types';

export function useAgreements({user}: {user: User | null}) {
  const { getContract } = useContract();

  const { agreements, setAgreements, setUserDatabaseContracts, userDatabaseContracts } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgreements = useCallback(async () => {
    if (!user?.address) {
      setAgreements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dbContracts = await getContracts(user.address);
      setUserDatabaseContracts(dbContracts);

      const agreementPromises = dbContracts.map(async (dbContract) => {
        try {
          const blockchainContract = await getContract(dbContract.contractAddress);
          return mapToAgreement(dbContract, blockchainContract, user.address);
        } catch (e) {
          console.error(`Failed to fetch blockchain data for ${dbContract.contractAddress}`, e);
          return null; 
        }
      });

      const settledAgreements = await Promise.all(agreementPromises);
      const validAgreements = settledAgreements.filter(a => a !== null);

      setAgreements(validAgreements);
    } catch (e) {
      console.error('Failed to fetch agreements:', e);
      setError('Failed to load agreements.');
    } finally {
      setLoading(false);
    }
  }, [user?.address, setAgreements, setUserDatabaseContracts]);

  return { agreements, loading, error, fetchAgreements };
}