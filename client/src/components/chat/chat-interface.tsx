import { useState } from "react";
import { Bot, Settings } from "lucide-react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { Message, SystemConfig, defaultSystemMessage } from "@/lib/types";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    content: defaultSystemMessage,
    enabled: false,
  });
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
        body: JSON.stringify({ 
          message: content,
          systemMessage: systemConfig.enabled ? systemConfig.content : undefined,
        }),
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
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] mx-auto max-w-4xl backdrop-blur-xl bg-background/50 border border-border/50">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-background/5 pointer-events-none" />

      <div className="relative px-2 sm:px-4 py-2 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="font-semibold">Agent Le Lang</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configure AI Personality</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Personality Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="system-message"
                    checked={systemConfig.enabled}
                    onCheckedChange={(checked) => 
                      setSystemConfig(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                  <Label htmlFor="system-message">Enable Custom Personality</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-content">System Message</Label>
                  <Textarea
                    id="system-content"
                    placeholder="Define the AI assistant's personality and behavior..."
                    value={systemConfig.content}
                    onChange={(e) => 
                      setSystemConfig(prev => ({ ...prev, content: e.target.value }))
                    }
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 sm:px-4 py-4">
        <MessageList messages={messages} isLoading={isLoading} />
      </ScrollArea>

      <div className="border-t border-border/50 p-2 backdrop-blur-sm">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
      <div className="text-xs text-muted-foreground text-center py-2">Developed + Coded by Lee Akpareva MBA, MA</div>
    </Card>
  );
}