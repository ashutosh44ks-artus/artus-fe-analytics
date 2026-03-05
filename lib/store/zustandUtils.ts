import { useLunaChatStore } from "./lunaChatStore";
import { useUserStore } from "./userStore";

export const resetAllStores = () => {
  useUserStore.getState().reset();
  useLunaChatStore.getState().reset();
};