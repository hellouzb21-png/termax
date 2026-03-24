import type { Provider, Message } from "../types.js";

interface OllamaChunk {
  message?: { content?: string };
  done?: boolean;
}

export function createOllamaProvider(
  baseUrl = "http://localhost:11434",
): Provider {
  return {
    name: "ollama",
    async *stream(messages: Message[], model: string) {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const chunk: OllamaChunk = JSON.parse(line);
          if (chunk.message?.content) {
            yield chunk.message.content;
          }
        }
      }
    },
  };
}
