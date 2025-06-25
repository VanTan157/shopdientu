interface NotificationStore {
  count: number;
  setCount: (count: number) => void;
  refreshCount: () => void;
}

import { create } from "zustand";
export const useNotificationStore = create<NotificationStore>((set) => ({
  count: 0,
  setCount: (count: number) => set({ count }),
  refreshCount: () => set((state) => ({ count: state.count })), // This can be used to trigger a refresh if needed
}));
