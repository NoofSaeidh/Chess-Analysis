# Chess Analysis

Analyze chess games on [Lichess](https://lichess.org) for any user. Enter a Lichess username to explore win/loss/draw rates, performance by time control, top openings, and rating history.

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode)
- **Vite** — build tool
- **Pinia** — state management
- **Vue Router** — client-side routing
- **Vitest** — unit testing with V8 coverage
- **ESLint 9** (flat config) + **Prettier** — code quality

## Features

- 🔍 **User Search** — look up any public Lichess profile
- 📊 **Overall Stats** — wins, losses, draws with visual progress bar
- ♟ **By Color** — separate stats as White and Black
- ⏱ **By Time Control** — performance across Bullet, Blitz, Rapid, etc.
- 📖 **Top Openings** — ECO-coded opening stats with win rates
- 🏆 **Top Opponents** — most frequently played opponents
- 📈 **Rating History** — rating progression over time

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests (watch mode) |
| `npm run test:coverage` | Run tests with V8 coverage report |
| `npm run lint` | Lint and auto-fix |
| `npm run lint:check` | Lint without fixing (CI) |
| `npm run format` | Format all files with Prettier |
| `npm run type-check` | TypeScript type-check only |

## Project Structure

```
src/
  api/             # Lichess HTTP client
  components/      # Reusable Vue components
  composables/     # Vue composables (useSearch, useCharts)
  router/          # Vue Router config
  stores/          # Pinia stores (user, analysis)
  types/           # TypeScript types
  utils/           # Pure utility functions
  views/           # Page-level views
```

## Testing

Unit tests are colocated with source files in `__tests__/` subdirectories.
Coverage thresholds: **80%** lines, functions, branches, statements.

```bash
npm run test:coverage
```

## Agent & AI Instructions

- **GitHub Copilot** — see `.github/agents.md`
- **Claude** — see `claude.md`

## API

Uses the free [Lichess API](https://lichess.org/api) — no authentication required for reading public game data.
