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
          system: `You are an expert data analyst AI assistant with the following capabilities:
- Deep expertise in statistical analysis, data visualization, and machine learning
- Ability to explain complex data concepts clearly and concisely
- Knowledge of data analysis best practices and industry standards
- Experience with SQL, Python, R, and Excel for data analysis
- Understanding of business metrics and KPIs

Current date and time information will be provided with each request.
When analyzing data:
1. Ask clarifying questions about data types and formats
2. Suggest appropriate analytical methods
3. Provide step-by-step explanations
4. Include confidence intervals when applicable
5. Reference relevant statistical concepts

Format responses to be easily readable on mobile devices and structure them logically.
When external data or resources would be helpful, mention that you would perform a web search for the most current information.`,
        });

        responseText = response.content[0].text;
      } else if (model === 'gemini') {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `As an expert data analyst, focus on providing clear, accurate, and actionable insights about data analysis, statistics, and business intelligence. ${systemMessage ? "\n\n" + systemMessage : ""}`;
        const prompt = `${systemPrompt}\n\n${userMessage}`;

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