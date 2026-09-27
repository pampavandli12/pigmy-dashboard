import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginSubBranch } from '../types/sharedEnums';
import type { BankType } from '../bankTypes/types';

export interface AuthState {
  token: string | null;
  bankName: string | null;
  bankCode: string | null;
  city: string | null;
  bankType: BankType | null;
  subBranches: LoginSubBranch[];
  isHydrated: boolean;
  setToken: (t: string) => void;
  setBankName: (b: string) => void;
  setBankCode: (c: string) => void;
  setCity: (city: string) => void;
  setBankType: (bankType: string) => void;
  setSubBranches: (subBranches: LoginSubBranch[]) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      bankName: null,
      bankCode: null,
      city: null,
      bankType: null,
      subBranches: [],
      isHydrated: false,
      setToken: (t: string) => set({ token: t }),
      setBankName: (b: string) => set({ bankName: b }),
      setBankCode: (c: string) => set({ bankCode: c }),
      setCity: (city: string) => set({ city }),
      // Cast at the API boundary: the login response is a raw string.
      setBankType: (bankType: string) => set({ bankType: bankType as BankType }),
      setSubBranches: (subBranches: LoginSubBranch[]) => set({ subBranches }),
      logout: () =>
        set({
          token: null,
          bankName: null,
          bankCode: null,
          city: null,
          bankType: null,
          subBranches: [],
        }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      version: 1,
      // Persist only the auth data — never the transient hydration flag.
      partialize: (state) => ({
        token: state.token,
        bankName: state.bankName,
        bankCode: state.bankCode,
        city: state.city,
        bankType: state.bankType,
        subBranches: state.subBranches,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
