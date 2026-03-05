import { create } from "zustand";
import { MarketingTeam, ProductTeam } from "@/lib/constants";

export type UserTeam = "marketing" | "product" | "unknown";
interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  clearUserState: () => void;
  getUserTeam: () => UserTeam;
}

export const useUserStore = create<UserState>((set) => ({
  userName: null,
  setUserName: (name) => set({ userName: name }),
  clearUserState: () => set({ userName: null }),
  getUserTeam: (): UserTeam => {
    const userName = useUserStore.getState().userName?.toLowerCase() || "";
    if (MarketingTeam.includes(userName)) {
      return "marketing";
    } else if (ProductTeam.includes(userName)) {
      return "product";
    } else {
      return "unknown";
    }
  },
}));
