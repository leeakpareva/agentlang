import { useState } from "react";
import { Bot } from "lucide-react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative flex flex-col h-[calc(100vh-12rem)] backdrop-blur-xl bg-background/50 border border-border/50">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-background/5 pointer-events-none" />

      <div className="relative px-4 py-2 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary animate-pulse" />
          <h1 className="font-semibold">Claude</h1>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <MessageList messages={messages} />
      </ScrollArea>

      <div className="border-t border-border/50 p-4 backdrop-blur-sm">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

      <div className="text-xs text-muted-foreground text-center py-2">Powered by Anthropic</div>
    </Card>
  );
}