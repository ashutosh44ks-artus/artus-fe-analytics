import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { AiChatItemLayout, baseStylesChatItem } from "./ChatItemHelpers";
import { LunaChatByIdSuccessResponse } from "@/services/luna";

const ChatItem = ({
  type,
  content,
}: LunaChatByIdSuccessResponse["history"][number]) => {
  // User Chat Items
  if (type === "human") {
    // User can only have one type
    return (
      <div
        className={cn(
          baseStylesChatItem.base,
          baseStylesChatItem.userChatItem,
          "border-primary-600/20 bg-primary-600/15 rounded-br-sm px-4 py-3 leading-snug text-white",
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <AiChatItemLayout
      className="border px-4 py-3 border-themePurple-400/20 bg-themePurple-600/10"
      label="Luna"
    >
      <MarkdownRenderer className="space-y-3 leading-snug">
        {content}
      </MarkdownRenderer>
    </AiChatItemLayout>
  );
};

export default ChatItem;
