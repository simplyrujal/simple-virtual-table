# Code Standards

**Scope (React):** `**/*.tsx` in `packages/react-virtual/`, `apps/react-app/`
**Scope (Svelte):** `**/*.svelte` in `packages/svelte-virtual/`, `apps/svelte-app/`

## React (.tsx)
**Focus: State Isolation & Minimal Effects**

- **Component Separation:** Extract state-heavy logic into child components. Siblings must not re-render on unrelated state changes.
- **Minimal `useEffect`:** Only for external subscriptions (DOM, WebSocket). Use render-time computation or event handlers for everything else.
- **Memoization:** Use `React.memo` for expensive renders and `useMemo`/`useCallback` ONLY for measurable performance gains or stable dependencies.
- **Deep State:** Use `useSyncExternalStore` or subscription-based stores for drilling >2 levels.

## Svelte (.svelte)
**Focus: Svelte 5 Runes & Granular Reactivity**

- **Runes Only:** Use `$state`, `$derived`, `$props`, and `$bindable`. Avoid legacy Svelte 4 syntax.
- **Granular Components:** Split large components to isolate `$effect` and expensive `$derived` calculations.
- **Minimal `$effect`:** Use `$derived` for sync transformations and event handlers for user actions. Use `$effect` only for side effects reaching outside Svelte (e.g., non-Svelte libs).
- **Reactive Context:** Pass getters in `setContext` to maintain reactivity across component boundaries without unnecessary re-runs.
