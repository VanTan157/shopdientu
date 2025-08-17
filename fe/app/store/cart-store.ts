import { create } from "zustand";

interface CartState {
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
  refreshCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItemCount: 0,
  setCartItemCount: (count: number) => set({ cartItemCount: count }),
  refreshCart: () => set((state) => ({ cartItemCount: state.cartItemCount })),
}));
