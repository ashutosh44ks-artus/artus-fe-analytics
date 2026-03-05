"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MdSend } from "react-icons/md";

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
    <div className="relative w-full md:w-3/4">
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={textAreaPlaceholder}
        rows={2}
        maxLength={15000}
        disabled={disabled}
        className="w-full pr-14 min-h-14 rounded-4xl px-3.5 py-3 text-sm! resize-none max-h-28 transition-all outline-hidden focus:outline-transparent focus:ring-0 focus:border-primary dark:focus:border-primary focus:shadow-lg focus:shadow-primary/10 focus-visible:ring-0 no-scrollbar disabled:cursor-not-allowed caret-primary-500!"
      />
      <Button
        size="icon-lg"
        onClick={handleSend}
        title="Send message"
        disabled={disabled}
        className="absolute bottom-2 right-2 rounded-full"
      >
        <MdSend />
      </Button>
    </div>
  );
};

export default ChatInput;
