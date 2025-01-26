import { Message } from "@/lib/types";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-4",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}
    >
      <div className="shrink-0">
        {isUser ? (
          <User className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium">
          {isUser ? "You" : "Claude"}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
