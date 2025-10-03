import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/auth.hook';
import { UserDatabaseContract } from '@/lib/model/agreement.types';
import {
  getContracts,
  addContract as addContractAction,
  removeContract as removeContractAction,
} from './contracts.actions';
import { useAppStore } from '../../store/app.store';

export function useContracts() {
  const { userDatabaseContracts, setUserDatabaseContracts } = useAppStore();

  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const loadUserContracts = useCallback(async () => {
    if (!auth.user?.address) {
      setUserDatabaseContracts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userContracts = await getContracts(auth.user.address);
      console.log(userContracts);
      setUserDatabaseContracts(userContracts);
    } catch (error) {
      console.error('❌ UserContracts: Failed to load contracts from server:', error);
      setUserDatabaseContracts([]);
    } finally {
      setLoading(false);
    }
  }, [auth.user?.address]);

  useEffect(() => {
    loadUserContracts();
  }, [loadUserContracts]);


  const addContract = useCallback(
    async (contract: Omit<UserDatabaseContract, 'createdAt'>) => {
      if (!auth.user?.address) {
        console.error('❌ useContracts: No user address, cannot add contract');
        return;
      }
      try {
        await addContractAction(auth.user.address, contract);
        // Re-fetch contracts to update the state
        await loadUserContracts();
      } catch (error) {
        console.error('Failed to add contract', error);
      }
    },
    [auth.user?.address, loadUserContracts]
  );


  const removeContract = useCallback(
    async (contractAddress: string) => {
      if (!auth.user?.address) return;
      try {
        await removeContractAction(auth.user.address, contractAddress);
        await loadUserContracts();
      } catch (error) {
        console.error('Failed to remove contract', error);
      }
    },
    [auth.user?.address, loadUserContracts]
  );


  const hasContract = useCallback(
    (contractAddress: string) => {
      return userDatabaseContracts.some(
        (c) => c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
      );
    },
    [userDatabaseContracts]
  );

  return {
    loading,
    addContract,
    removeContract,
    hasContract,
  };
}