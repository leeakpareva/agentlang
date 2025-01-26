import { ChatInterface } from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <ChatInterface />
      </div>
    </div>
  );
}