export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Provider {
  name: string;
  stream(messages: Message[], model: string): AsyncIterable<string>;
}

export interface Config {
  provider: "openai" | "anthropic" | "ollama";
  model: string;
  apiKey?: string;
  ollamaUrl?: string;
  systemPrompt: string;
}

export const DEFAULT_MODELS: Record<string, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-20250514",
  ollama: "llama3.2",
};
