import chalk from "chalk";
import ora from "ora";
import { Marked } from "marked";
import { markedTerminal } from "marked-terminal";
import { createOpenAIProvider } from "./providers/openai.js";
import { createAnthropicProvider } from "./providers/anthropic.js";
import { createOllamaProvider } from "./providers/ollama.js";
import { getConfig } from "./config.js";
import { DEFAULT_MODELS } from "./types.js";
import type { Provider, Message } from "./types.js";

const marked = new Marked(markedTerminal() as any);

function getProvider(): Provider {
  const config = getConfig();

  switch (config.provider) {
    case "openai": {
      const key = config.apiKey ?? process.env.OPENAI_API_KEY;
      if (!key) {
        console.error(
          chalk.red(
            "No OpenAI API key. Run: termax config set apiKey YOUR_KEY",
          ),
        );
        process.exit(1);
      }
      return createOpenAIProvider(key);
    }
    case "anthropic": {
      const key = config.apiKey ?? process.env.ANTHROPIC_API_KEY;
      if (!key) {
        console.error(
          chalk.red(
            "No Anthropic API key. Run: termax config set apiKey YOUR_KEY",
          ),
        );
        process.exit(1);
      }
      return createAnthropicProvider(key);
    }
    case "ollama":
      return createOllamaProvider(config.ollamaUrl);
    default:
      console.error(chalk.red(`Unknown provider: ${config.provider}`));
      process.exit(1);
  }
}

export async function ask(prompt: string, piped?: string): Promise<void> {
  const config = getConfig();
  const provider = getProvider();
  const model = config.model || DEFAULT_MODELS[config.provider];

  const messages: Message[] = [
    { role: "system", content: config.systemPrompt },
  ];

  if (piped) {
    messages.push({
      role: "user",
      content: `Here is some content:\n\`\`\`\n${piped}\n\`\`\`\n\n${prompt}`,
    });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  const spinner = ora({
    text: chalk.dim(`${provider.name}/${model}`),
    spinner: "dots",
  }).start();

  let fullResponse = "";

  try {
    let first = true;
    for await (const chunk of provider.stream(messages, model)) {
      if (first) {
        spinner.stop();
        console.log();
        first = false;
      }
      fullResponse += chunk;
      process.stdout.write(chunk);
    }

    // Render final markdown
    process.stdout.write("\r\x1b[K"); // clear current line
    const rendered = marked.parse(fullResponse) as string;
    // Move cursor up to overwrite raw text, then print rendered
    const rawLines = fullResponse.split("\n").length;
    process.stdout.write(`\x1b[${rawLines}A\x1b[J`);
    process.stdout.write(rendered);
    console.log();
  } catch (err: any) {
    spinner.stop();
    console.error(chalk.red(`\nError: ${err.message}`));
    process.exit(1);
  }
}

export async function chat(): Promise<void> {
  const readline = await import("node:readline");
  const config = getConfig();
  const provider = getProvider();
  const model = config.model || DEFAULT_MODELS[config.provider];

  console.log(
    chalk.bold.cyan("\n  termax") +
      chalk.dim(` — ${provider.name}/${model}\n`),
  );
  console.log(chalk.dim('  Type your message. "exit" to quit.\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages: Message[] = [
    { role: "system", content: config.systemPrompt },
  ];

  const prompt = (): void => {
    rl.question(chalk.green("❯ "), async (input) => {
      const trimmed = input.trim();
      if (!trimmed || trimmed === "exit" || trimmed === "quit") {
        console.log(chalk.dim("\nGoodbye!\n"));
        rl.close();
        return;
      }

      messages.push({ role: "user", content: trimmed });

      const spinner = ora({ text: chalk.dim("thinking..."), spinner: "dots" }).start();
      let fullResponse = "";

      try {
        let first = true;
        for await (const chunk of provider.stream(messages, model)) {
          if (first) {
            spinner.stop();
            console.log();
            first = false;
          }
          fullResponse += chunk;
          process.stdout.write(chunk);
        }

        console.log();
        messages.push({ role: "assistant", content: fullResponse });
      } catch (err: any) {
        spinner.stop();
        console.error(chalk.red(`Error: ${err.message}`));
      }

      console.log();
      prompt();
    });
  };

  prompt();
}
