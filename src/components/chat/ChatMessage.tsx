type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "assistant") {
    return (
      <div className="flex flex-col items-start max-w-[90%]">
        {/* UPLIFT Label */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-normal text-primary uppercase tracking-wide">
            UPLIFT
          </span>
        </div>
        
        {/* Message Content */}
        <p className="text-base text-brown-900 leading-relaxed">
          {message.content}
        </p>
      </div>
    );
  }

  // User message (aligned right)
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-card rounded-2xl px-4 py-3 border-2 border-border">
        <p className="text-base text-brown-900 leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};
