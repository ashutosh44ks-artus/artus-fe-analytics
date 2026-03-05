import { useCallback, useMemo } from "react";
import { fixBackendResponseFormatting } from "./utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLunaChatById,
  LunaChatByIdSuccessResponse,
  lunaChatQueryKeys,
  postLunaChatMessage,
} from "@/services/luna";
import { AxiosError } from "axios";
import ChatInput from "./ChatInput";
import ChatViewUIContainer from "./ChatViewUIContainer";
import { useLunaChatStore } from "@/lib/store/lunaChatStore";

const ChatContainer = () => {
  const queryClient = useQueryClient();
  const activeChatId = useLunaChatStore((state) => state.activeChatId);
  const setActiveChatId = useLunaChatStore((state) => state.setActiveChatId);
  const streamState = useLunaChatStore((state) => state.streamState);
  const setStreamState = useLunaChatStore((state) => state.setStreamState);

  const sendMessageMutationFn = useMutation({
    mutationFn: async (variables: {
      content: string;
      chatId: number | "new";
    }) => {
      const { content, chatId } = variables;

      setStreamState("waiting");
      const response = await postLunaChatMessage(content, chatId);

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let finalChatId = chatId;

      // 1. Create a placeholder for the AI response in the cache
      const queryKey = lunaChatQueryKeys.chat(chatId);

      let hasReceivedFirstChunk = false;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (!hasReceivedFirstChunk) {
          hasReceivedFirstChunk = true;
          setStreamState("streaming");
        }

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // 1. Extract the data FIRST in the main loop scope
        const { processedData, processedValue } =
          fixBackendResponseFormatting(fullContent);

        if (processedValue?.chat_id) {
          finalChatId = processedValue.chat_id;
        }

        // 2. Then update the UI cache
        queryClient.setQueryData(
          queryKey,
          (old: LunaChatByIdSuccessResponse["history"]) => {
            const messages = [...(old || [])];
            const lastMsg = messages[messages.length - 1];

            if (lastMsg?.type === "ai") {
              // if last message is from ai, update that message with new content
              return messages.map((m, i) =>
                i === messages.length - 1
                  ? {
                      ...m,
                      content: processedData,
                    }
                  : m,
              );
            } else {
              // if last message is from user, add another message for ai response
              return [
                ...messages,
                {
                  type: "ai",
                  content: processedData,
                },
              ];
            }
          },
        );
      }

      setStreamState("idle");
      // Now finalChatId is guaranteed to be the last value caught in the loop
      return {
        chat_id: finalChatId,
      };
    },
    // Optimistic update to add the user's message immediately to the chat
    onMutate: async ({ content, chatId }) => {
      const tempQueryKey = lunaChatQueryKeys.chat(chatId);
      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: tempQueryKey,
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(tempQueryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(
        tempQueryKey,
        (old: LunaChatByIdSuccessResponse["history"]) => [
          ...(old || []),
          {
            content: content,
            type: "human",
          },
        ],
      );

      // Return context with the previous messages for rollback
      return { previousMessages };
    },
    onSuccess: (data, variables) => {
      const { chatId: originalChatId } = variables;

      // update chat id if it's a new chat
      if (data.chat_id && originalChatId === "new") {
        setActiveChatId(data.chat_id);
        // invalidate chatHistory to show the new chat in the list
        const oldKey = lunaChatQueryKeys.chat("new");
        const newKey = lunaChatQueryKeys.chat(data.chat_id);
        const cachedMessages = queryClient.getQueryData(oldKey);
        if (cachedMessages) {
          queryClient.setQueryData(newKey, cachedMessages);
          queryClient.removeQueries({ queryKey: oldKey });
        }

        const historyKey = lunaChatQueryKeys.allChats();
        queryClient.invalidateQueries({ queryKey: historyKey });
      } else if (!data.chat_id) {
        console.warn("No chat_id returned from API");
      }
      // Invalidate queries to refetch relevant data after success
      // const targetChatId = data.chat_id || originalChatId;
      // queryClient.invalidateQueries({
      //   queryKey: [
      //     projectId,
      //     currentModuleId,
      //     'chatMessages',
      //     targetChatId,
      //     'implementation-chat',
      //   ],
      // });
    },
    onError: (error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          lunaChatQueryKeys.chat(variables.chatId),
          context.previousMessages,
        );
      }
      console.warn("An error occurred:", error.message);
      setStreamState("idle");
    },
    onSettled: () => {
      setStreamState("idle");
    },
  });
  const sendMessage = useCallback(
    async (message: string) => {
      try {
        sendMessageMutationFn.mutate({
          content: message,
          chatId: activeChatId,
        });
      } catch (error) {
        console.error("Error sending chat message:", error);
      }
    },
    [sendMessageMutationFn, activeChatId],
  );
  const { data: chatMessages } = useQuery<
    LunaChatByIdSuccessResponse["history"],
    AxiosError
  >({
    queryKey: lunaChatQueryKeys.chat(activeChatId),
    queryFn: async () => {
      if (activeChatId === "new") return [];
      const data = await getLunaChatById(activeChatId);
      if (data.history && Array.isArray(data.history)) {
        return data.history;
      } else return [];
    },
    placeholderData: (previousData) => previousData,
    // Only fetch if there is no data in the cache
    staleTime: Infinity,
  });

  const finalChatInputLocking = useMemo(() => {
    if (sendMessageMutationFn.isPending) return true;
    if (streamState === "waiting" || streamState === "streaming") return true;
    return false;
  }, [sendMessageMutationFn.isPending, streamState]);
  const isWaitingForFirstChunk =
    sendMessageMutationFn.isPending && streamState === "waiting";

  return (
    <>
      <ChatViewUIContainer
        activeChatId={activeChatId}
        chatMessages={chatMessages || []}
        isWaitingForFirstChunk={isWaitingForFirstChunk}
      />
      <ChatInput sendMessage={sendMessage} disabled={finalChatInputLocking} />
    </>
  );
};

export default ChatContainer;
