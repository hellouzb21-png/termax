#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { ask, chat } from "./chat.js";
import { getConfig, setConfig, getConfigPath } from "./config.js";
import { DEFAULT_MODELS } from "./types.js";

const program = new Command();

program
  .name("termax")
  .description("AI assistant in your terminal")
  .version("0.1.0");

// Default command: ask a question
program
  .argument("[prompt...]", "Ask AI a question")
  .option("-p, --provider <provider>", "AI provider (openai, anthropic, ollama)")
  .option("-m, --model <model>", "Model to use")
  .action(async (promptWords: string[], opts) => {
    // Check for piped input
    let piped: string | undefined;
    if (!process.stdin.isTTY) {
      const chunks: Buffer[] = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      piped = Buffer.concat(chunks).toString("utf-8").trim();
    }

    // Apply flag overrides
    if (opts.provider) setConfig("provider", opts.provider);
    if (opts.model) setConfig("model", opts.model);

    const prompt = promptWords.join(" ");

    if (!prompt && !piped) {
      // Interactive chat mode
      await chat();
    } else if (!prompt && piped) {
      await ask("Explain this:", piped);
    } else {
      await ask(prompt, piped);
    }
  });

// Config subcommand
const configCmd = program.command("config").description("Manage configuration");

configCmd
  .command("set <key> <value>")
  .description("Set a config value")
  .action((key, value) => {
    setConfig(key, value);
    console.log(chalk.green(`  ✓ ${key} = ${key === "apiKey" ? "***" : value}`));
  });

configCmd
  .command("get [key]")
  .description("Show config")
  .action((key) => {
    const config = getConfig();
    if (key) {
      const val = config[key as keyof typeof config];
      console.log(
        key === "apiKey" && val ? "***" : (val ?? chalk.dim("not set")),
      );
    } else {
      console.log(chalk.bold("\n  termax config\n"));
      console.log(`  provider:  ${chalk.cyan(config.provider)}`);
      console.log(
        `  model:     ${chalk.cyan(config.model || DEFAULT_MODELS[config.provider] + chalk.dim(" (default)"))}`,
      );
      console.log(`  apiKey:    ${config.apiKey ? chalk.green("set") : chalk.red("not set")}`);
      console.log(`  ollama:    ${config.ollamaUrl ?? chalk.dim("default")}`);
      console.log(`  path:      ${chalk.dim(getConfigPath())}`);
      console.log();
    }
  });

// Provider shortcuts
program
  .command("ollama")
  .description("Switch to Ollama (local, free)")
  .action(() => {
    setConfig("provider", "ollama");
    console.log(chalk.green("  ✓ Switched to Ollama"));
    console.log(chalk.dim("    Make sure Ollama is running: ollama serve"));
  });

program
  .command("openai")
  .description("Switch to OpenAI")
  .action(() => {
    setConfig("provider", "openai");
    console.log(chalk.green("  ✓ Switched to OpenAI"));
  });

program
  .command("anthropic")
  .description("Switch to Anthropic")
  .action(() => {
    setConfig("provider", "anthropic");
    console.log(chalk.green("  ✓ Switched to Anthropic"));
  });

program.parse();
