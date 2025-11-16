import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="fixed bottom-[104px] left-0 right-0 px-4 pb-4 bg-background">
      <div className="relative bg-card rounded-2xl p-4 border-2 border-border max-w-md mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your intention, desire, or manifestation"
          className="w-full min-h-[120px] bg-transparent text-sm text-brown-900 placeholder:text-brown-600 resize-none outline-none pr-14"
          style={{ height: "120px" }}
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-brown-900" />
        </button>
      </div>
    </div>
  );
};
