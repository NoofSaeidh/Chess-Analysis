# Chess Analysis — Claude Instructions

This file provides project context and coding conventions for Claude when working in this repository. It mirrors `.github/agents.md` with additional context about the codebase design.

## What This Project Does

Fetches and analyzes chess games for a given [Lichess](https://lichess.org) user. The user enters a Lichess username, the app fetches their game history via the public Lichess API, and displays statistics: win/loss/draw rates, performance by time control, opening statistics, opponent stats, and rating history.

## Architecture Decisions

### Why `LichessApiClient` as a class?

The API client is a class so it can be easily instantiated with a custom `baseUrl` in tests without relying on module-level mocking of `axios`. The `lichessApi` singleton is exported for production use.

### Why Pinia setup stores (not option stores)?

Setup stores (using `() => { ... }`) compose cleanly with `computed`, `ref`, and other Vue reactivity primitives. They also make TypeScript inference easier. `analysisStore` depends on `userStore` via `computed` refs — this avoids circular import issues and ensures reactivity.

### Why pure utils in `src/utils/`?

`analysis.ts` and `format.ts` contain pure functions that can be tested in isolation without a Vue/Pinia environment. Keep all domain logic there; keep Vue components thin.

### NDJSON parsing

Lichess streams game data as [NDJSON](https://ndjson.org/). The `parseNdJson` private method splits on newlines, filters empty lines, and JSON-parses each one. Do not change this without updating the corresponding tests.

## Files You Will Commonly Edit

| File | When to edit |
|------|-------------|
| `src/api/lichess.ts` | Adding new Lichess API endpoints |
| `src/types/lichess.ts` | Adding/updating Lichess API type shapes |
| `src/types/analysis.ts` | Adding new analysis result types |
| `src/utils/analysis.ts` | Adding new statistical computations |
| `src/utils/format.ts` | Adding new formatting helpers |
| `src/stores/userStore.ts` | Changing how user/game data is fetched |
| `src/stores/analysisStore.ts` | Changing analysis logic, filters |
| `src/components/` | Updating UI |
| `src/composables/` | Changing component-level logic |
| `src/views/` | Changing page-level layout or behavior |

## Strict Rules — Non-Negotiable

1. **No `any`.** Use `unknown` and type guards or proper generics.
2. **No `!` (non-null assertion).** Use `?? fallback` or `?.` chaining.
3. **Explicit return types** on all exported functions.
4. **`import type`** for every type-only import.
5. **`<script setup lang="ts">`** for every Vue SFC.
6. **No `console.log`** in production code — only `console.warn` / `console.error`.
7. **Tests are required** for every new module or function.
8. **No side effects at module level** outside of `main.ts`.

## How to Add a New Feature

1. **Add types** in `src/types/` if new data shapes are needed.
2. **Add API method** in `src/api/lichess.ts` if new data must be fetched.
3. **Add util functions** in `src/utils/analysis.ts` or `src/utils/format.ts`.
4. **Update store** if new state is required.
5. **Add composable** if logic is shared between components.
6. **Create component** in `src/components/` (reusable) or `src/views/` (page-level).
7. **Write tests** for every new file following the pattern in `src/*/__tests__/`.

## Testing Patterns

### Mocking the API
```typescript
vi.mock('@/api/lichess', () => ({
  lichessApi: { getUser: vi.fn(), getUserGames: vi.fn() },
}))
```

### Setting up Pinia per test
```typescript
beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})
```

### Mounting components
```typescript
const wrapper = mount(MyComponent, { props: { ... } })
```

## Coding Style Preferences

- **Short, focused functions** — if a function is longer than ~40 lines, break it up.
- **Descriptive names** — `computeWinLossDraw` over `calc` or `process`.
- **No magic numbers** — extract constants with names.
- **`const` everywhere** — `let` only when reassignment is genuinely needed.
- **Early returns** over deeply nested if/else.
- **`reduce` with explicit return type** — always annotate the accumulator type.

## Running the Project Locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Common Gotchas

- Lichess returns NDJSON (not JSON) for game streams — do not use `response.json()`.
- Lichess usernames are case-insensitive; always compare with `.toLowerCase()`.
- `getPlayerColor` returns `null` if the user is not found in the game — always handle this.
- `buildGameAnalyses` silently skips games where the user is not a player.
- TypeScript default parameter with `undefined` **uses the default value** — avoid `param = defaultValue` if you need callers to pass explicit `undefined`.
