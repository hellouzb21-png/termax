import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { Message } from "./types.js";

const HISTORY_FILE = path.join(os.homedir(), ".termax_history.json");

export function loadHistory(limit = 20): Message[] {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Message[];
    return parsed.slice(-limit);
  } catch {
    return [];
  }
}

export function saveHistory(messages: Message[]): void {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(messages.slice(-50), null, 2), "utf-8");
  } catch {
    // ignore write errors in restricted environments
  }
}

export function clearHistory(): void {
  try {
    if (fs.existsSync(HISTORY_FILE)) fs.unlinkSync(HISTORY_FILE);
  } catch {
    // ignore
  }
}
