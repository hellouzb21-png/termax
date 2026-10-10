# termax

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](package.json)
[![Anthropic Claude](https://img.shields.io/badge/Anthropic-Claude%204.5-orange.svg)](https://www.anthropic.com)

> **AI assistant in your terminal.** Fast, minimal, pipe-friendly CLI powered by Anthropic Claude, OpenAI, and local Ollama models.

```bash
$ termax "explain quicksort in 3 lines"
$ git diff | termax "write a conventional commit message"
$ cat error.log | termax "diagnose the root cause and suggest a fix"
$ termax                 # interactive multi-turn chat mode
```

## Why termax?

Developers spend hours context-switching between terminal workflows and browser chat windows. **termax** brings streaming LLM reasoning directly into standard UNIX pipes (`stdin`/`stdout`), enabling instant log analysis, automated code reviews on `git diff`, shell command synthesis, and interactive debugging without leaving the command line.

## Key Features

- **First-class Anthropic Claude Support** — Powered by `@anthropic-ai/sdk` with streaming token output and `claude-sonnet-4-5` / `claude-haiku` support.
- **UNIX Pipe Native** — `cat file | termax "explain"` works seamlessly with any CLI tool.
- **Interactive Multi-Turn REPL** — Persistent conversation history across debugging sessions.
- **Built-in Engineering Presets** — `review`, `commit`, `shell`, and `default` system personas.
- **Zero Bloat** — Lightweight TypeScript/Node.js footprint with sub-100ms cold start.

## Installation

```bash
npm install -g termax
```

## Quick Start with Claude

```bash
# Configure Anthropic API Key
termax config set apiKey sk-ant-...
termax anthropic

# Review staged changes before committing
git diff --staged | termax "check for security flaws and edge cases"

# Generate commit message
git diff --staged | termax "write a concise conventional commit message"

# Analyze logs in real time
tail -n 100 /var/log/syslog | termax "summarize anomalies"
```

## CLI Reference

```
termax [prompt...]          Ask a question or start interactive REPL
termax config set <k> <v>   Configure provider, model, or apiKey
termax config get           Display active configuration
termax anthropic            Switch active provider to Anthropic Claude
termax openai               Switch active provider to OpenAI
termax ollama               Switch active provider to local Ollama
```

## Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Released under the [MIT License](LICENSE).
