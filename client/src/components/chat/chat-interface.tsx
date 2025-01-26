import { useState, useRef } from "react";
import { Bot, Settings, Download, Upload } from "lucide-react";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { Message, SystemConfig, ChatHistory, defaultSystemMessage } from "@/lib/types";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    content: defaultSystemMessage,
    enabled: false,
    model: 'claude'
  });
  const [tempConfig, setTempConfig] = useState<SystemConfig>(systemConfig);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          model: systemConfig.model
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

  const handleSaveSettings = () => {
    setSystemConfig(tempConfig);
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
    setIsSettingsOpen(false);
  };

  const handleSettingsOpen = () => {
    setTempConfig(systemConfig);
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setTempConfig(systemConfig);
    setIsSettingsOpen(false);
  };

  const handleExportChat = () => {
    try {
      const chatHistory: ChatHistory = {
        messages,
        systemConfig
      };
      const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Chat history exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export chat history",
        variant: "destructive",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const chatHistory = JSON.parse(content) as ChatHistory;
        setMessages(chatHistory.messages);
        setSystemConfig(chatHistory.systemConfig);
        toast({
          title: "Success",
          description: "Chat history imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import chat history",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] mx-auto max-w-3xl">
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