import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// describe the shape of the auth store
interface SubBranch {
  bankCode: string;
  bankName: string;
  city: string;
}
export interface AuthState {
  token: string | null;
  bankName: string | null;
  bankCode: string | null;
  city: string | null;
  subBranches: SubBranch[];
  isHydrated: boolean;
  setToken: (t: string) => void;
  setBankName: (b: string) => void;
  setBankCode: (c: string) => void;
  setCity: (city: string) => void;
  setSubBranches: (subBranches: SubBranch[]) => void;
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
      subBranches: [],
      isHydrated: false,
      setToken: (t: string) => set({ token: t }),
      setBankName: (b: string) => set({ bankName: b }),
      setBankCode: (c: string) => set({ bankCode: c }),
      setCity: (city: string) => set({ city }),
      setSubBranches: (subBranches: SubBranch[]) => set({ subBranches }),
      logout: () =>
        set({
          token: null,
          bankName: null,
          bankCode: null,
          city: null,
          subBranches: [],
        }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
