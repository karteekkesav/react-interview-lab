# Custom Hooks

## Interview Definition

Custom hooks are reusable functions that use React hooks internally. They let you extract stateful logic from components without changing the component hierarchy.

## Deep Explanation

A custom hook is a JavaScript or TypeScript function whose name starts with `use`. It can call built-in hooks like `useState`, `useEffect`, and `useMemo`.

Custom hooks do not share state automatically. Each component call gets its own independent hook state unless the hook connects to shared external state.

## Example Used In This Folder

`CustomHooksExample.tsx` defines `useLocalStorageState`. The hook reads an initial value from `localStorage`, stores it in state, and syncs updates back to `localStorage`.

This is a common interview example because it combines state, effects, lazy initialization, and reusable abstraction.

## Common Interview Questions

Why create custom hooks?

To reuse stateful logic across components and keep components focused on UI.

Why must a custom hook start with `use`?

The naming convention lets React tooling enforce the Rules of Hooks.

Do custom hooks share state between components?

No. Each call has isolated state unless the hook uses shared external storage or context.

## Common Mistakes

Calling hooks conditionally inside a custom hook.

Creating custom hooks for logic that is not reused or complex.

Forgetting that browser APIs like `localStorage` may not exist in server environments.

## Best Practices

Extract hooks when behavior is reused or when it clarifies a component.

Keep hook inputs and return values explicit.

Hide implementation details but keep behavior easy to test.

## Quick Revision Notes

Custom hooks reuse stateful logic.

Their names start with `use`.

Each hook call owns its own state.
