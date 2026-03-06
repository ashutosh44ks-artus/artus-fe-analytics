import { create } from "zustand";

interface LunaMemoriesState {
  searchInput: string;
  setSearchInput: (input: string) => void;

  reset: () => void;
}

const initialState = {
  searchInput: "",
} satisfies Pick<LunaMemoriesState, "searchInput">;

export const useLunaMemoriesStore = create<LunaMemoriesState>((set) => ({
  ...initialState,

  setSearchInput: (input) => set({ searchInput: input }),

  reset: () => set(initialState),
}));
