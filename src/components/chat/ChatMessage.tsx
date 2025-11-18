type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
  isThinking?: boolean;
}

export const ChatMessage = ({ message, isThinking = false }: ChatMessageProps) => {
  if (message.role === "assistant") {
    return (
      <div className="flex flex-col items-start max-w-[90%] mb-6">
        {/* UPLIFT Label */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6C00] to-[#FFC107] ${
            isThinking ? 'animate-pulse-glow' : ''
          }`} />
          <span className={`text-xs font-normal text-muted-foreground tracking-wide ${isThinking ? 'italic' : 'uppercase'}`}>
            {isThinking ? 'thinking...' : 'UPLIFT'}
          </span>
        </div>
        
        {/* Message Content */}
        {message.content && (
          <p className="text-base text-brown-900 leading-relaxed">
            {message.content}
          </p>
        )}
      </div>
    );
  }

  // User message (aligned right)
  return (
    <div className="flex justify-end mb-6">
      <div className="max-w-[80%] bg-card rounded-2xl px-4 py-3 border-2 border-border">
        <p className="text-base text-brown-900 leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};
