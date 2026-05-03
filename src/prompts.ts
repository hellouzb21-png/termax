export interface SystemPreset {
  name: string;
  description: string;
  systemPrompt: string;
}

export const PRESETS: Record<string, SystemPreset> = {
  default: {
    name: "default",
    description: "Concise terminal engineering assistant",
    systemPrompt: "You are termax, a fast and concise AI assistant running in the user's terminal. Prefer actionable code snippets and direct explanations.",
  },
  review: {
    name: "review",
    description: "Security and bug-focused code reviewer",
    systemPrompt: "Review the piped input or code diff for bugs, race conditions, security vulnerabilities, and performance bottlenecks. Output concise bullet points.",
  },
  commit: {
    name: "commit",
    description: "Conventional commit message generator",
    systemPrompt: "Generate a clean Conventional Commit message (feat, fix, refactor, docs, chore) summarizing the provided git diff.",
  },
  shell: {
    name: "shell",
    description: "POSIX / bash / zsh command generator",
    systemPrompt: "Return only the exact shell command needed to accomplish the task, with a one-line explanation underneath.",
  },
};
