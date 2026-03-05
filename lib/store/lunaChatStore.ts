import { create } from "zustand";

export type StreamState = "idle" | "waiting" | "streaming";

interface LunaChatState {
  activeChatId: number | "new";
  setActiveChatId: (id: number | "new") => void;

  chatInput: string;
  setChatInput: (input: string) => void;

  streamState: StreamState;
  setStreamState: (state: StreamState) => void;

  reset: () => void;
}

const initialState = {
  activeChatId: "new",
  chatInput: "",
  streamState: "idle",
} satisfies Pick<LunaChatState, "activeChatId" | "chatInput" | "streamState">;

export const useLunaChatStore = create<LunaChatState>((set) => ({
  ...initialState,

  setActiveChatId: (id) => set({ activeChatId: id }),
  setChatInput: (input) => set({ chatInput: input }),
  setStreamState: (state) => set({ streamState: state }),

  reset: () => set(initialState),
}));
