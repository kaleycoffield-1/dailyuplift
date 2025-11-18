interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  userName?: string;
  isThinking?: boolean;
}

export const MessageBubble = ({ role, content, userName = "You", isThinking = false }: MessageBubbleProps) => {
  if (role === "assistant") {
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6C00] to-[#FFC107] ${
            isThinking ? 'animate-pulse-glow' : ''
          }`}></div>
          <span className="text-xs font-normal text-brown-700 uppercase">
            {isThinking ? 'thinking...' : 'UPLIFT'}
          </span>
        </div>
        {content && (
          <p className="text-base text-brown-900 leading-relaxed max-w-[90%]">
            {content}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-5 flex flex-col items-end">
      <span className="text-sm font-semibold text-brown-900 mb-2">{userName}</span>
      <div className="bg-card rounded-2xl px-4 py-3 max-w-[80%]">
        <p className="text-sm text-brown-900 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};
