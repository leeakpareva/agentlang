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
    <Card className="relative flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] mx-auto max-w-4xl backdrop-blur-xl bg-background/50 border border-border/50">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-background/5 pointer-events-none" />

      <div className="relative px-2 sm:px-4 py-2 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="font-semibold">Agent Le Lang</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleExportChat()}
              disabled={messages.length === 0}
              title="Export chat history"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Export chat history</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUploadClick}
              title="Import attachment"
            >
              <Upload className="h-4 w-4" />
              <span className="sr-only">Import attachment</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
              aria-label="Import attachment"
            />
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSettingsOpen}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Configure AI Personality</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Configuration</DialogTitle>
                  <DialogDescription>
                    Configure the AI assistant's personality and behavior. You can switch between different AI models and customize how they respond.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Model</Label>
                    <Select
                      value={tempConfig.model}
                      onValueChange={(value: 'claude' | 'gemini') => 
                        setTempConfig(prev => ({ ...prev, model: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude">Claude</SelectItem>
                        <SelectItem value="gemini">Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system-message"
                      checked={tempConfig.enabled}
                      onCheckedChange={(checked) => 
                        setTempConfig(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                    <Label htmlFor="system-message">Enable Custom Personality</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="system-content">System Message</Label>
                    <Textarea
                      id="system-content"
                      placeholder="Define the AI assistant's personality and behavior..."
                      value={tempConfig.content}
                      onChange={(e) => 
                        setTempConfig(prev => ({ ...prev, content: e.target.value }))
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleSettingsClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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