import { create } from "zustand";
import { StreamState } from "../components/utils";

interface LunaChatState {
  activeChatId: number | "new";
  setActiveChatId: (id: number | "new") => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  streamState: StreamState;
  setStreamState: (state: StreamState) => void;
}

export const useLunaChatStore = create<LunaChatState>((set) => ({
  activeChatId: "new",
  setActiveChatId: (id) => set({ activeChatId: id }),
  chatInput: "",
  setChatInput: (input) => set({ chatInput: input }),
  streamState: "idle",
  setStreamState: (state) => set({ streamState: state }),
}));
