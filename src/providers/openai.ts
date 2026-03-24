import OpenAI from "openai";
import type { Provider, Message } from "../types.js";

export function createOpenAIProvider(apiKey: string): Provider {
  const client = new OpenAI({ apiKey });

  return {
    name: "openai",
    async *stream(messages: Message[], model: string) {
      const stream = await client.chat.completions.create({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) yield text;
      }
    },
  };
}
