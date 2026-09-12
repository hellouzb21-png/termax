# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-10-10
### Added
- Native support for Anthropic `claude-sonnet-4-5` and extended 8192 token output streaming.
- Built-in system prompt presets (`review`, `commit`, `shell`).
- Multi-file context attachment utility (`src/context.ts`).

## [1.1.0] - 2026-07-15
### Added
- Persistent session conversation history (`~/.termax_history.json`).
- GitHub Actions CI matrix for Node.js 20 and 22.

## [1.0.0] - 2026-03-24
### Added
- Initial release supporting Anthropic Claude, OpenAI, and Ollama streaming in terminal.
