import Anthropic from "@anthropic-ai/sdk";
import type { Provider, Message } from "../types.js";

export function createAnthropicProvider(apiKey: string): Provider {
  const client = new Anthropic({ apiKey });

  return {
    name: "anthropic",
    async *stream(messages: Message[], model: string) {
      const systemMsg = messages.find((m) => m.role === "system");
      const chatMsgs = messages.filter((m) => m.role !== "system");

      const stream = await client.messages.stream({
        model,
        max_tokens: 4096,
        system: systemMsg?.content ?? "",
        messages: chatMsgs.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield event.delta.text;
        }
      }
    },
  };
}
