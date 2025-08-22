type CountUpdater = number | ((prev: number) => number);

interface NotificationStore {
  count: number;
  setCount: (count: CountUpdater) => void;
  refreshCount: () => void;
}

import { create } from "zustand";
export const useNotificationStore = create<NotificationStore>((set) => ({
  count: 0,
  setCount: (count: CountUpdater) =>
    set((state) => ({
      count:
        typeof count === "function"
          ? (count as Function)(state.count)
          : (count as number),
    })),
  refreshCount: () => set((state) => ({ count: state.count })), // This can be used to trigger a refresh if needed
}));
