import MarkdownRenderer from "@/components/MarkdownRenderer";
import { cn } from "@/lib/utils";

export const baseStylesChatItem = {
  base: "max-w-[85%] w-fit text-[0.825rem] wrap-break-word",
  aiChatItem: "self-start rounded-xl rounded-bl-sm w-fit",
  userChatItem: "self-end ml-auto rounded-xl rounded-br-sm whitespace-pre-wrap",
};

export const AiChatItemLayout = ({
  children,
  className,
  containerClassName,
  label = "Luna",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  label?: string;
}) => {
  return (
    <div
      className={cn(baseStylesChatItem.base, "space-y-2", containerClassName)}
    >
      <div className="text-2xs flex items-center gap-2 font-medium text-blue-500 uppercase">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-blue-500"
          aria-hidden="true"
        ></span>
        {label}
      </div>
      <div className={cn(baseStylesChatItem.aiChatItem, className)}>
        {children}
      </div>
    </div>
  );
};

export const AiChatItem = ({
  children,
  isMarkdown = true,
}: {
  children: React.ReactNode;
  isMarkdown?: boolean;
}) => {
  return (
    <AiChatItemLayout className="border px-4 py-3 border-gray-400/20 bg-gray-900">
      {isMarkdown ? (
        <MarkdownRenderer className="space-y-3 leading-snug">
          {children}
        </MarkdownRenderer>
      ) : (
        children
      )}
    </AiChatItemLayout>
  );
};
