import { ChatInterface } from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Chat with Claude
          </h1>
          <p className="mt-2 text-muted-foreground">
            Powered by Anthropic's Claude AI
          </p>
        </header>
        <ChatInterface />
      </div>
    </div>
  );
}
