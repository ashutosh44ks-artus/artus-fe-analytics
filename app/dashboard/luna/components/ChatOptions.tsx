import { useLunaChatStore } from "@/lib/store/lunaChatStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AiOutlineHistory, AiOutlinePlus } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import {
  getLunaChatHistoryItems,
  LunaChatHistoryItemsSuccessResponse,
  lunaChatQueryKeys,
} from "@/services/luna";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";

interface ChatHistoryItemProps {
  chatHistory: LunaChatHistoryItemsSuccessResponse["chats"];
  activeChatId: number | "new";
  onSelectChat: (id: number | "new") => void;
  isLoading: boolean;
  error: AxiosError | null;
}
const ChatHistoryContent = ({
  chatHistory,
  activeChatId,
  onSelectChat,
  isLoading,
  error,
}: ChatHistoryItemProps) => {
  if (isLoading) {
    return (
      <div className="rounded-md px-2 py-1 text-sm">
        Loading chat history...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md px-2 py-1 text-sm text-red-500">
        Error loading chat history.
      </div>
    );
  }
  if (chatHistory.length === 0) {
    return (
      <div className="rounded-md px-2 py-1 text-sm">
        No chat history available.
      </div>
    );
  }
  return chatHistory.map((chat) => (
    <div
      key={chat.chat_id}
      className={cn(
        "cursor-pointer rounded-md px-2 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-700",
        chat.chat_id === activeChatId && "bg-primary-50 dark:bg-primary/20",
      )}
      onClick={() => onSelectChat(chat.chat_id)}
    >
      {chat.title}
    </div>
  ));
};

const ChatOptions = () => {
  const activeChatId = useLunaChatStore((state) => state.activeChatId);
  const setActiveChatId = useLunaChatStore((state) => state.setActiveChatId);
  const setChatInput = useLunaChatStore((state) => state.setChatInput);

  const { data, isLoading, error } = useQuery<
    LunaChatHistoryItemsSuccessResponse["chats"],
    AxiosError
  >({
    queryKey: lunaChatQueryKeys.allChats(),
    queryFn: async () => {
      const temp = await getLunaChatHistoryItems();
      return temp.chats;
    },
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => {
          setActiveChatId("new");
          setChatInput("");
        }}
        title="New Chat"
        // disabled={isStreaming}
      >
        <AiOutlinePlus size={12} />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Chat History"
            //   disabled={isStreaming}
          >
            <AiOutlineHistory size={14} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1!" align="end">
          <div className="max-h-60 overflow-y-auto text-slate-700 dark:text-slate-300">
            <p className="text-xs mb-1 px-2 font-medium tracking-wide uppercase dark:text-gray-400">
              Chat History
            </p>
            <ChatHistoryContent
              chatHistory={data || []}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatOptions;
