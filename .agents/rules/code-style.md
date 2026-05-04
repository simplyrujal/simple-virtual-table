# Code Style Rules

## General

- Use TypeScript
- No comments unless explaining complex logic
- Use const over let
- Use early returns
- Keep functions small (max 30 lines)

## React

- Use functional components with hooks
- Use `.tsx` for components, `.ts` for utilities
- Props interface at top of file
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed as props

## Svelte

- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Use `.svelte` for components, `.ts` for utilities
- Use store runes for shared state
- Use `$:` for reactive statements

## Naming

- Components: PascalCase
- Files: kebab-case
- Interfaces: PascalCase with `I` prefix (React) or none (Svelte)
- Constants: SCREAMING_SNAKE_CASE