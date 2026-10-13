# Memoization Pitfalls

## Interview Definition

Memoization can reduce unnecessary work, but overusing it or using it with unstable dependencies can add complexity without improving performance.

## Deep Explanation

`React.memo` uses shallow prop comparison. If you pass a new object, array, or function every render, memoized children still re-render. `useMemo` and `useCallback` can stabilize references, but they also have a cost and can create stale closure bugs if dependencies are wrong.

## Example Used In This Folder

`MemoizationPitfallsExample.tsx` passes a memoized object to a memoized child to show why stable references matter.

## Common Interview Questions

Should everything be memoized?

No. Memoize when there is a real performance reason.

Why does `React.memo` not help sometimes?

Props may still be new references on every render.

What is a stale closure?

A function captures old values because its dependencies were incomplete.

## Common Mistakes

Adding empty dependency arrays incorrectly.

Memoizing cheap calculations.

Passing unstable object props to memoized components.

## Best Practices

Measure first.

Keep dependencies correct.

Prefer simpler code until optimization is needed.

## Quick Revision Notes

Memoization is not free.

Shallow compare checks references.

Wrong dependencies create stale bugs.
