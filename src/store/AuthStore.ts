import { create } from "zustand";
import { persist } from "zustand/middleware";

// describe the shape of the auth store
export interface AuthState {
  token: string | null;
  bankName: string | null;
  bankCode: string | null;
  isHydrated: boolean;
  setToken: (t: string) => void;
  setBankName: (b: string) => void;
  setBankCode: (c: string) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      bankName: null,
      bankCode: null,
      isHydrated: false,
      setToken: (t: string) => set({ token: t }),
      setBankName: (b: string) => set({ bankName: b }),
      setBankCode: (c: string) => set({ bankCode: c }),
      logout: () => set({ token: null, bankName: null, bankCode: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
