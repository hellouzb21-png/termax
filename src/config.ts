import Conf from "conf";
import type { Config } from "./types.js";

const store = new Conf<Config>({
  projectName: "termax",
  defaults: {
    provider: "openai",
    model: "",
    systemPrompt:
      "You are a helpful AI assistant in the terminal. Be concise and use markdown formatting.",
  },
});

export function getConfig(): Config {
  return {
    provider: store.get("provider"),
    model: store.get("model"),
    apiKey: store.get("apiKey"),
    ollamaUrl: store.get("ollamaUrl"),
    systemPrompt: store.get("systemPrompt"),
  };
}

export function setConfig(key: keyof Config, value: string): void {
  store.set(key, value);
}

export function getConfigPath(): string {
  return store.path;
}
