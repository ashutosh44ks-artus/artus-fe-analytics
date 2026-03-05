import { create } from "zustand";
import { MarketingTeam, ProductTeam } from "@/lib/constants";

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  clearUserState: () => void;
  isUserFromMarketingTeam: () => boolean;
  isUserFromProductTeam: () => boolean;
}

export const useUserStore = create<UserState>((set) => ({
  userName: null,
  setUserName: (name) => set({ userName: name }),
  clearUserState: () => set({ userName: null }),
  isUserFromMarketingTeam: (): boolean => {
    return MarketingTeam.includes(
      useUserStore.getState().userName?.toLowerCase() || "",
    );
  },
  isUserFromProductTeam: (): boolean => {
    return ProductTeam.includes(
      useUserStore.getState().userName?.toLowerCase() || "",
    );
  },
}));
