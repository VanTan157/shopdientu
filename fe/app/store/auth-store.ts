import { create } from "zustand";

export interface authStore {
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuthStore = create<authStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setRefreshToken: (token: string | null) => set({ refreshToken: token }),
}));
