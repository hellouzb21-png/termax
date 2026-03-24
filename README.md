# termax

> AI assistant in your terminal. Fast, minimal, multi-provider.

```
$ termax "explain quicksort in 3 lines"
$ cat error.log | termax "what went wrong?"
$ termax                 # interactive chat mode
```

## Features

- **Multi-provider** — OpenAI, Anthropic (Claude), Ollama (local/free)
- **Pipe-friendly** — `cat file | termax "explain"` just works
- **Interactive chat** — conversation with history
- **Streaming** — real-time token-by-token output
- **Minimal** — no bloat, fast startup

## Install

```bash
npm install -g termax
```

## Quick Start

```bash
# Use with Ollama (free, local)
termax ollama
termax "hello world"

# Use with OpenAI
termax config set apiKey sk-...
termax openai
termax "write a python fibonacci function"

# Use with Claude
termax config set apiKey sk-ant-...
termax anthropic
termax "review this code" < main.py

# Pipe anything
git diff | termax "write a commit message"
cat package.json | termax "any security issues?"
curl -s api.example.com | termax "parse this response"
```

## Usage

```
termax [prompt...]          Ask a question (or start chat if no prompt)
termax config set <k> <v>  Set config (provider, model, apiKey)
termax config get           Show current config
termax ollama               Switch to Ollama
termax openai               Switch to OpenAI
termax anthropic            Switch to Anthropic
```

### Options

```
-p, --provider <name>    Override provider for this request
-m, --model <name>       Override model for this request
```

## Providers

| Provider | Models | API Key Required |
|----------|--------|-----------------|
| OpenAI | gpt-4o-mini, gpt-4o, etc. | Yes |
| Anthropic | claude-sonnet, claude-haiku, etc. | Yes |
| Ollama | llama3.2, mistral, codellama, etc. | No (local) |

## License

MIT
