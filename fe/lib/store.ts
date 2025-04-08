// lib/store.ts
import { create } from "zustand";
import { apiGet } from "@/lib/api";
import { Mobile } from "./validate/mobile";
type MobileStore = {
  mobiles: Mobile[];
  setMobiles: (products: Mobile[]) => void;
};

export const useMobileStore = create<MobileStore>((set) => ({
  mobiles: [],
  setMobiles: (mobiles) => set({ mobiles }),
}));
