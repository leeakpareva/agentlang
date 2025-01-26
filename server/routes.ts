import type { Express } from "express";
import { createServer, type Server } from "http";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function registerRoutes(app: Express): Server {
  // the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemMessage, model = 'claude' } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Add current date and time information
      const now = new Date();
      const dateTimeContext = `Current date and time: ${now.toLocaleString()}`;
      const userMessage = `${dateTimeContext}\n\nUser request: ${message}`;

      let responseText = '';

      if (model === 'claude') {
        const messages = [];
        if (systemMessage) {
          messages.push({ role: "user" as const, content: systemMessage });
        }
        messages.push({ role: "user" as const, content: userMessage });

        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: messages,
          system: `You are a helpful AI assistant with the following capabilities:
- You can tell the current time and date
- You can help with various tasks and queries
- You should format responses to be easily readable on mobile devices
- You can perform web searches when needed for up-to-date information

Current date and time information will be provided with each request.
When searching is needed, mention that you would perform a web search for the most current information.`,
        });

        responseText = response.content[0].text;
      } else if (model === 'gemini') {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `${systemMessage ? systemMessage + "\n\n" : ""}${userMessage}`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
      }

      res.json({ message: responseText });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ 
        error: "Failed to get response from AI model" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}