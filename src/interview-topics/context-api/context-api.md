# Context API

## Interview Definition

Context API lets React components access shared values without passing props through every intermediate level.

## Deep Explanation

Context is useful for app-level data such as theme, authenticated user, locale, feature flags, or dependency objects. A provider makes a value available, and nested components read that value with `useContext`.

Context should not replace all state management. If a value changes very often or has complex update logic, a dedicated state management pattern may be more appropriate.

## Example Used In This Folder

`ContextApiExample.tsx` creates a typed `ThemeContext`. The nested `Toolbar` component reads the current theme and calls `toggleTheme` without receiving props from the parent.

The custom `useTheme` helper throws a clear error if the hook is used outside the provider.

## Common Interview Questions

What problem does Context solve?

It avoids prop drilling for values needed by many nested components.

When should you avoid Context?

Avoid it for every small piece of local state and for high-frequency updates that can cause broad re-renders.

Does Context make state global?

It shares values with the provider subtree. The scope depends on where the provider is placed.

## Common Mistakes

Putting rapidly changing local state into a top-level context.

Using context where simple props would be clearer.

Forgetting to handle the case where a context consumer is outside its provider.

## Best Practices

Use context for cross-cutting app values.

Keep provider values stable when performance matters.

Wrap `useContext` in a custom hook for clearer errors and cleaner usage.

## Quick Revision Notes

Context avoids prop drilling.

Provider supplies the value.

Consumers read it with `useContext`.
