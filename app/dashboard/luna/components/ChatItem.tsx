import { AiChatItem, UserChatItem } from "./ChatItemHelpers";
import { LunaChatMessage } from "@/services/luna";

const ChatItem = ({ type, content }: LunaChatMessage) => {
  if (type === "human") {
    return <UserChatItem>{content}</UserChatItem>;
  }

  return <AiChatItem isMarkdown>{content}</AiChatItem>;
};

export default ChatItem;
