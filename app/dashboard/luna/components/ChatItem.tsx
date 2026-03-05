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
          "bg-primary dark:bg-primary/80 rounded-br-sm px-4 py-3 leading-snug text-white",
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <AiChatItemLayout
      className="border bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
      label="Luna"
    >
      <MarkdownRenderer className="space-y-3 leading-snug">
        {content}
      </MarkdownRenderer>
    </AiChatItemLayout>
  );
};

export default ChatItem;