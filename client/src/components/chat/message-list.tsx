import { Message } from "@/lib/types";
import { MessageItem } from "@/components/chat/message-item";
import { Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">
          Welcome to NAVADA
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2 text-sm transition-all bg-gradient-to-br from-muted/50 to-muted backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="font-medium">Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}