import { create } from "zustand";
import { Agreement, AgreementStatus, UserDatabaseContract } from "@/lib/model/agreement.types";

interface AppState {
  currentAgreementStatusEvent?: AgreementStatus;
  setCurrentAgreementStatusEvent: (status: AgreementStatus) => void;

  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;

  agreements: Agreement[];
  setAgreements: (agreements: Agreement[]) => void;
  
  userDatabaseContracts: UserDatabaseContract[];
  setUserDatabaseContracts: (userDatabaseContracts: UserDatabaseContract[]) => void;

  currentAgreement: Agreement | null;
  setCurrentAgreement: (agreement: Agreement | null) => void;

  currentAgreementLoading: boolean;
  setCurrentAgreementLoading: (isLoading: boolean) => void;
  currentAgreementError: string | null;
  setCurrentAgreementError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAgreementStatusEvent: undefined,
  setCurrentAgreementStatusEvent: (status: AgreementStatus) => set({ currentAgreementStatusEvent: status }),

  agreements: [],
  setAgreements: (agreements: Agreement[]) => set({ agreements }),

  userDatabaseContracts: [],
  setUserDatabaseContracts: (userDatabaseContracts: UserDatabaseContract[]) => set({ userDatabaseContracts }),

  isAuthLoading: false,
  setIsAuthLoading: (isAuthLoading: boolean) => set({ isAuthLoading }),

  currentAgreement: null,
  setCurrentAgreement: (currentAgreement: Agreement | null) => set({ currentAgreement }),

  currentAgreementLoading: true,
  setCurrentAgreementLoading: (isLoading: boolean) => set({ currentAgreementLoading: isLoading }),

  currentAgreementError: null,
  setCurrentAgreementError: (error: string | null) => set({ currentAgreementError: error }),
}));

