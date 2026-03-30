import { create } from "zustand";
import { MarketingTeam, ProductTeam, USER_TEAMS } from "@/lib/constants";

export type UserTeam = typeof USER_TEAMS[keyof typeof USER_TEAMS];

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

    if (MarketingTeam.includes(userName)) return USER_TEAMS.MARKETING;
    if (ProductTeam.includes(userName)) return USER_TEAMS.PRODUCT;

    return USER_TEAMS.UNKNOWN;
  },

  reset: () => set(initialState),
}));
