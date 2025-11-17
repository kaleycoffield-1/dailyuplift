interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  userName?: string;
}

export const MessageBubble = ({ role, content, userName = "You" }: MessageBubbleProps) => {
  if (role === "assistant") {
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-xs font-normal text-primary uppercase">UPLIFT</span>
        </div>
        <p className="text-base text-brown-900 leading-relaxed max-w-[90%]">
          {content}
        </p>
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
