"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useWallet } from '../web3/wallet/wallet.hook';
import { SupportedNetworkIds } from '@/lib/model/network.config';
import { useAppStore } from '../store/app.store';
import { User } from '@/lib/model/agreement.types';
import { isZeroAddress } from '../../helpers/contract.helpers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  clearError: () => void;
  checkUserRole: (creatorAddress: string, depositorAddress?: string) => { isCreator: boolean; isDepositor: boolean };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAuthLoading, setIsAuthLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const wallet = useWallet();

  // Initialize auth state based on wallet connection
  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      const newUser: User = {
        address: wallet.address,
        isConnected: true,
        networkId: wallet.selectedNetworkId as SupportedNetworkIds,
      };
      
      if (!isAuthenticated || user?.address !== wallet.address) {
        setUser(newUser);
        setIsAuthenticated(true);
        setIsAuthLoading(false);
        setError(null);

        // Ensure correct network after authentication
        wallet.ensureAmoyNetwork?.().then((onAmoy) => {
          if (onAmoy === false) {
            setError('Please switch to Polygon Amoy network');
            toast.error('Please switch to Polygon Amoy network');
          }
        }).catch(console.warn);
      }
    } else if (!wallet.isConnected && isAuthenticated) {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, [wallet.isConnected, wallet.address, isAuthenticated, user?.address, wallet.selectedNetworkId]);

  const login = useCallback(async () => {
    setIsAuthLoading(true);
    setError(null);

    try {
      await wallet.open();
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  }, [wallet, setIsAuthLoading]);

  const checkUserRole = useCallback((creatorAddress: string, depositorAddress?: string) => {
    const userAddress = user?.address?.toLowerCase();
    const creator = creatorAddress?.toLowerCase();
    const depositor = depositorAddress?.toLowerCase();

    const isCreator = userAddress === creator;
    const isDepositor = (userAddress === depositor || isZeroAddress(depositor!) || !depositor) && userAddress !== creator;

    return { isCreator, isDepositor };
  }, [user?.address]);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAuthLoading,
    error,
    login,
    clearError,
    checkUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}