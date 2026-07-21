# Chess Analysis — Agent Instructions

This file provides instructions for GitHub Copilot coding agents working in this repository.

## Project Overview

A TypeScript + Vue 3 single-page application that fetches and analyzes chess games for a given Lichess user via the public [Lichess API](https://lichess.org/api).

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Vue 3 | ^3.5 | UI framework (Composition API + `<script setup>`) |
| TypeScript | ^5.7 | Language (strict mode) |
| Vite | ^6 | Build tool |
| Pinia | ^2.3 | State management |
| Vue Router | ^4.5 | Client-side routing |
| Vitest | ^2.1 | Unit testing |
| ESLint 9 | flat config | Linting |
| Prettier | ^3 | Formatting |

## Directory Structure

```
src/
  api/           # HTTP clients (LichessApiClient)
  components/    # Reusable Vue SFCs
  composables/   # Vue composables (useSearch, useCharts)
  router/        # Vue Router configuration
  stores/        # Pinia stores (userStore, analysisStore)
  types/         # TypeScript interfaces & type aliases
  utils/         # Pure functions (analysis, format)
  views/         # Page-level Vue SFCs
```

## Commands

```bash
npm run dev          # Start dev server on :5173
npm run build        # Type-check + Vite build
npm run test         # Run unit tests (watch mode)
npm run test:coverage # Run tests with V8 coverage
npm run lint         # ESLint with auto-fix
npm run format       # Prettier with auto-format
npm run type-check   # vue-tsc type check only
```

## Code Conventions

### TypeScript

- **Strict mode is mandatory.** All `compilerOptions.strict*` flags are enabled in `tsconfig.app.json`.
- Use `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`).
- No `any` — use `unknown` with type narrowing or proper generics.
- No non-null assertions (`!`) — use optional chaining and nullish coalescing.
- All function signatures must have explicit return types.

### Vue Components

- Every SFC must use `<script setup lang="ts">` (Composition API).
- Block order: `<script>`, `<template>`, `<style scoped>`.
- Always call `defineOptions({ name: 'ComponentName' })`.
- Props must be typed with `defineProps<{ ... }>()`.
- Emits must be typed with `defineEmits<{ ... }>()`.
- Scoped styles only (`<style scoped>`).

### State Management (Pinia)

- Use the **setup store** style (`defineStore('id', () => { ... })`).
- Stores live in `src/stores/`. One store per domain concept.
- Stores must expose loading flags and error strings (never raw Error objects).
- Never import one store inside another store's reactive context — use computed refs that reference other stores lazily.

### Testing

- **Every new module must have a co-located test file** in `__tests__/`.
- Test file naming: `MyModule.spec.ts`.
- Mock `@/api/lichess` with `vi.mock` in store/composable tests.
- Component tests use `@vue/test-utils` `mount` (not `shallowMount` unless necessary).
- Coverage thresholds: 80% lines, functions, branches, statements.
- Run `npm run test:coverage` before merging.

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component file | PascalCase | `UserProfile.vue` |
| Composable file | camelCase prefixed with `use` | `useSearch.ts` |
| Store file | camelCase suffixed with `Store` | `userStore.ts` |
| Utility file | camelCase | `analysis.ts`, `format.ts` |
| Type file | camelCase | `lichess.ts`, `analysis.ts` |
| CSS class | kebab-case (BEM-inspired) | `.user-profile__bio` |

## API Integration

- **Base URL**: `https://lichess.org`
- All HTTP access goes through `LichessApiClient` in `src/api/lichess.ts`.
- Games are returned as NDJSON; the client parses them internally.
- Throw `LichessApiError` (never raw Axios errors) from API methods.
- The `lichessApi` singleton is exported for use in stores.

## Security

- No authentication tokens are stored or committed.
- All API calls are to the public read-only Lichess API endpoints.
- User input (usernames) is URL-encoded before being appended to API paths.

## Pull Request Guidelines

1. All tests must pass (`npm run test`).
2. Coverage must not drop below 80% (`npm run test:coverage`).
3. `npm run lint:check` must exit 0.
4. `npm run type-check` must exit 0.
5. Keep commits atomic and scoped to a single concern.
