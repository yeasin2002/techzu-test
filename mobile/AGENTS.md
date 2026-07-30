# Product

expo-starter is a cross-platform mobile app starter template built with Expo. It targets iOS, Android, and web from a single codebase.

The template ships with theming (light/dark), file-based navigation, and a component foundation — intended as a production-ready starting point rather than a demo.

<!-- Structure -->

# Project Structure

```
src/
  app/           # Expo Router screens (file-based routing)
  assets/        # Static assets (images, fonts)
  components/    # Shared UI components
  contexts/      # React context providers
  lib/           # Utility modules (env, helpers)
  global.css     # Tailwind + Uniwind + HeroUI style imports
```

## Conventions

**Imports** — use the `@/*` alias for all `src/` imports (e.g. `@/components/container`).

**Screens** — live in `src/app/`. Each file is a route. `_layout.tsx` wraps the stack/tab navigator.

**Components** — named exports, not default exports. Props typed inline or with a local `type Props = ...`.

**Contexts** — one file per context in `src/contexts/`. Export the provider component and a `use*` hook that throws if used outside the provider.

**Environment variables** — define and validate in `src/lib/env.ts` using `@t3-oss/env-core` + `zod`. All client vars must be prefixed `EXPO_PUBLIC_`.

**Styling** — use Tailwind/Uniwind `className` props. Use `cn()` from `heroui-native` for conditional class merging. Wrap third-party components with `withUniwind()` to enable className support.

**Theming** — theme state lives in `AppThemeProvider` (`src/contexts/app-theme-context.tsx`). Use `useAppTheme()` to read or toggle the theme. Do not call `Uniwind.setTheme()` directly outside the context.

**Animations** — use `react-native-reanimated`. Animated components are created with `Animated.createAnimatedComponent()`.

**Root layout** — provider order in `_layout.tsx`: `GestureHandlerRootView` → `KeyboardProvider` → `AppThemeProvider` → `HeroUINativeProvider`.

<!-- Tech  -->

# Tech Stack

## Core

- **React Native 0.83** + **React 19** + **Expo 55**
- **TypeScript 5** (strict mode, `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`)
- **Expo Router 55** — file-based routing with typed routes enabled
- **React Compiler** — enabled via Expo experiments

## Styling

- **Uniwind** — Tailwind-for-React-Native utility. Wrap third-party components with `withUniwind()` to apply className props.
- **TailwindCSS 4** — configured via `src/global.css`
- **HeroUI Native** — component library; wrapped in `<HeroUINativeProvider>`
- `tailwind-merge` and `tailwind-variants` available for class composition

## Key Libraries

- `react-native-reanimated` 4 — animations
- `react-native-gesture-handler` — gestures (requires `<GestureHandlerRootView>` at root)
- `react-native-keyboard-controller` — keyboard handling (requires `<KeyboardProvider>` at root)
- `react-native-safe-area-context` — safe area insets
- `@gorhom/bottom-sheet` — bottom sheets
- `expo-haptics`, `expo-secure-store`, `expo-font`, `expo-constants`, etc.
- `@t3-oss/env-core` + `zod` — type-safe environment variables via `src/lib/env.ts`

## Linting & Formatting

- **Oxlint** + **Oxfmt** (via `ultracite`) — primary linter and formatter
- **ESLint** — configured via `eslint.config.mjs` using `ultracite/eslint/core` and `ultracite/eslint/react`, scoped to `src/**`
- **Prettier** — config delegates to `ultracite/prettier`
- **Lefthook** — pre-commit hooks run `oxlint --fix` and `oxfmt --write` on staged files

## Package Manager

- **pnpm** (workspace-aware via `pnpm-workspace.yaml`)

## Common Commands

```bash
pnpm dev              # Start Expo dev server (clears cache)
pnpm start            # Start Expo dev server
pnpm ios              # Run on iOS simulator
pnpm android          # Run on Android emulator
pnpm web              # Run in browser
pnpm check            # Lint + format check (ultracite)
pnpm fix              # Lint + format fix (ultracite)
pnpm check-types      # TypeScript type check (tsc --noEmit)
pnpm knip             # Dead code / unused exports check
```


# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.





<!-- BEGIN:behavioral-guidelines -->

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Restricted file or this file: you don't need to edit.

- node_modules/
- android
  These are the files that are restricted and not only that. That folder or file that is mentioned in the.gitignore, do not edit or modify anything on that particular file or folder.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- END:behavioral-guidelines -->