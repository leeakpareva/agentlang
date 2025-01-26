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
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2 text-sm transition-all hover:shadow-lg",
        isUser
          ? "ml-auto bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
          : "bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm border border-border/50"
      )}
    >
      <div className="flex items-center gap-2">
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        <span className="font-medium">{isUser ? "You" : "Claude"}</span>
      </div>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  );
}