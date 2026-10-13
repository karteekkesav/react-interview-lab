# useCallback

## Interview Definition

`useCallback` memoizes a function reference so React can reuse the same callback between renders until its dependencies change.

## Deep Explanation

In React, functions are recreated on every render. That is usually fine. `useCallback` becomes useful when a stable function reference is needed, commonly when passing callbacks to memoized child components or when a callback is a dependency of another hook.

`useCallback(fn, deps)` is similar to `useMemo(() => fn, deps)`.

Important clarification:

`useCallback` does not stop a function from running.

It only controls whether React reuses the same function reference between renders.

```text
useCallback controls function creation
onClick controls function execution
```

So if a button calls the callback, the callback runs every time the button is clicked.

## Example Used In This Folder

`UseCallbackExample.tsx` passes a memoized `handleSave` callback to a memoized `SaveButton`.

The example has two important actions:

1. Click `Re-render parent`

The parent component re-renders, but `answer` does not change. Because `handleSave` depends on `[answer]`, React reuses the same function reference. Since `SaveButton` is wrapped in `memo`, it can skip re-rendering.

2. Click `Save answer`

The button executes `handleSave`, so the `console.log` inside `handleSave` runs every time. This is expected.

Visual:

```text
Parent re-renders
  |
  v
useCallback checks [answer]
  |
  +-- answer same ----> reuse same handleSave function
  |
  +-- answer changed -> create new handleSave function

User clicks Save
  |
  v
button calls handleSave
  |
  v
handleSave runs
```

Interview point:

`useCallback` memoizes the function reference. It does not prevent the function from executing when it is called.

## Common Interview Questions

What does `useCallback` return?

It returns a memoized function reference.

How is `useCallback` different from `useMemo`?

`useCallback` memoizes a function. `useMemo` memoizes a calculated value.

Should we wrap every function in `useCallback`?

No. Use it when stable references matter. Otherwise it adds noise without benefit.

## Common Mistakes

Using `useCallback` everywhere.

Missing dependencies and creating stale closures.

Expecting `useCallback` to stop the parent component from rendering.

## Best Practices

Use it with memoized children when callback identity causes unnecessary renders.

Keep dependency arrays correct.

Prefer simple inline handlers unless there is a clear reason.

## Quick Revision Notes

Memoizes function references.

Useful with `React.memo` children.

Dependencies prevent stale closures.
