# Code Standards

## Scope

- **React:** `**/*.tsx` in `packages/react-virtual/`, `apps/react-app/`
- **Svelte:** `**/*.svelte` in `packages/svelte-virtual/`, `apps/svelte-app/`

---

## React (.tsx)

**Focus:** State Isolation & Minimal Effects

### 1. General Principles

- **Component Separation:** Extract state-heavy logic into child components. Siblings must not re-render on unrelated state changes.
- **Minimal `useEffect`:** Only for external subscriptions (DOM, WebSocket). Use render-time computation or event handlers for everything else.
- **Memoization:** Use `React.memo` for expensive renders. Use `useMemo`/`useCallback` **only** for measurable performance gains or maintaining stable dependencies.

### 2. Deep State Management (`useSyncExternalStore`)

For shared state subscribed to by multiple components, prefer the `useSyncExternalStore` pattern over Context + `useState` to avoid the "re-render-all-subscribers" problem.

#### The Store Pattern

```typescript
// store.ts
type Listener = () => void;

function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getSnapshot: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState: (updater: (prev: T) => T) => {
      state = updater(state);
      listeners.forEach((l) => l());
    },
  };
}

// hook.ts
import { useSyncExternalStore } from "react";

export function useStore<T>(store: ReturnType<typeof createStore<T>>) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
```

#### Performance Optimization: Stable Method Hooks

If a hook only needs to call a store method (action) without reading state, **skip** `useSyncExternalStore`. This prevents unnecessary subscriptions.

| Hook Type                   | Uses `useSyncExternalStore` | Re-renders on State Change        |
| :-------------------------- | :-------------------------- | :-------------------------------- |
| `useSelector(s => s.field)` | Yes                         | Yes (when selected value changes) |
| `useDispatch()`             | No                          | Never                             |

#### Selector Best Practices: Prefer Primitives

`useSyncExternalStore` uses `Object.is` for comparison. Always select the deepest primitive to avoid unnecessary re-renders from new object references.

- ❌ **Avoid:** `const stats = useSelector(s => s.stats);` (Re-renders on every dispatch)
- ✅ **Prefer:** `const total = useSelector(s => s.stats.total);` (Only re-renders when `total` changes)

---

## Svelte (.svelte)

**Focus:** Svelte 5 Runes & Granular Reactivity

### 1. General Principles

- **Runes Only:** Use `$state`, `$derived`, `$props`, and `$bindable`. Avoid legacy Svelte 4 syntax.
- **Granular Components:** Split large components to isolate `$effect` and expensive `$derived` calculations.
- **Minimal `$effect`:**
  - Use `$derived` for synchronous state transformations.
  - Use event handlers for user actions.
  - Use `$effect` **only** for side effects reaching outside Svelte (e.g., non-Svelte libraries, DOM manual manipulation).
- **Reactive Context:** Pass getters (or state objects) in `setContext` to maintain reactivity across boundaries without triggering global re-runs.
