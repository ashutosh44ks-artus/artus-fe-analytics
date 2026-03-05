import { create } from 'zustand';

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  clearUserState: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userName: null,
  setUserName: (name) => set({ userName: name }),
  clearUserState: () => set({ userName: null }),
}));
