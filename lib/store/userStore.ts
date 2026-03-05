import { create } from "zustand";
import { MarketingTeam, ProductTeam } from "@/lib/constants";

export type UserTeam = "marketing" | "product" | "unknown";

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  getUserTeam: () => UserTeam;
  reset: () => void;
}

const initialState = {
  userName: null,
} satisfies Pick<UserState, "userName">;

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  setUserName: (name) => set({ userName: name }),

  getUserTeam: (): UserTeam => {
    const userName = get().userName?.toLowerCase() ?? "";

    if (MarketingTeam.includes(userName)) return "marketing";
    if (ProductTeam.includes(userName)) return "product";

    return "unknown";
  },

  reset: () => set(initialState),
}));
