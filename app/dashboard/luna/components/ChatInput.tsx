"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  sendMessage: (message: string) => void;
  disabled?: boolean;
  textAreaPlaceholder?: string;
}
const ChatInput = ({
  sendMessage,
  disabled = false,
  textAreaPlaceholder = "Ask Luna anything...",
}: ChatInputProps) => {
  // textarea states
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSend = () => {
    const message = inputValue.trim();
    if (!message) return;
    setInputValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Call parent handler
    sendMessage(message);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-4 border-t dark:border-neutral-700 flex gap-2.5 items-center">
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={textAreaPlaceholder}
        rows={1}
        className="flex-1 min-h-0 rounded-xl px-3.5 py-3 text-xs! resize-none max-h-28 transition-all outline-hidden focus:outline-transparent focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 focus-visible:ring-0 modern-scroll disabled:cursor-not-allowed caret-blue-500!"
        maxLength={15000}
        disabled={disabled}
      />
      <Button
        size="icon-lg"
        onClick={handleSend}
        title="Send message"
        disabled={disabled}
      >
        ↑
      </Button>
    </div>
  );
};

export default ChatInput;
