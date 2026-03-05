"use client";

import { useRef, useEffect, useState } from "react";
import ChatItem from "./ChatItem";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { AiOutlineArrowDown } from "react-icons/ai";
import TypingIndicator from "@/components/TypingIndicator";
import { AiChatItem } from "./ChatItemHelpers";
import { LunaChatByIdSuccessResponse } from "@/services/luna";
import NewChatShortcuts from "./NewChatShortcuts";

interface ChatViewStreamingProps {
  activeChatId: number | "new";
  chatMessages: LunaChatByIdSuccessResponse["history"];
  isWaitingForFirstChunk: boolean;
}
export default function ChatViewStreaming({
  activeChatId,
  chatMessages,
  isWaitingForFirstChunk,
}: ChatViewStreamingProps) {
  const lastMessageRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevChatMessagesLengthRef = useRef<number | null>(null);
  const prevActiveChatIdRef = useRef(activeChatId);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    // Scroll to last message end only if new message added or active chat changed
    if (
      chatMessages.length !== prevChatMessagesLengthRef.current ||
      activeChatId !== prevActiveChatIdRef.current
    ) {
      scrollToBottom();
    }
    prevChatMessagesLengthRef.current = chatMessages.length;
    prevActiveChatIdRef.current = activeChatId;
  }, [chatMessages, activeChatId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        // using requestAnimationFrame for better performance
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
          // Determine if we're near the bottom (within 500px of last message)
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 500;
          setShowScrollButton(!isNearBottom);
          ticking = false;
        });
        ticking = true;
      }
    };
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [chatMessages]);

  if (chatMessages.length === 0) {
    return <NewChatShortcuts />;
  }
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className="modern-scroll animate-subtleSlideFromLeft flex-1 space-y-4 overflow-x-hidden overflow-y-auto pb-5"
        ref={scrollContainerRef}
      >
        {chatMessages.map(
          (
            item: LunaChatByIdSuccessResponse["history"][number],
            index: number,
          ) => (
            <div
              key={`${activeChatId}-${index}`}
              ref={index === chatMessages.length - 1 ? lastMessageRef : null}
            >
              <ChatItem {...item} />
            </div>
          ),
        )}
        {isWaitingForFirstChunk && (
          <AiChatItem isMarkdown={false}>
            <TypingIndicator />
          </AiChatItem>
        )}
      </div>
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-8 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full p-0"
          variant="default"
          aria-label="Scroll to bottom"
        >
          <AiOutlineArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
