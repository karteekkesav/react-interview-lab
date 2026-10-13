# useMemo

## Interview Definition

`useMemo` memoizes the result of an expensive calculation and recalculates it only when its dependencies change.

## Deep Explanation

React re-renders components when state or props change. Most calculations are cheap and do not need memoization. `useMemo` is useful when a derived value is expensive, when referential stability matters for child components, or when a calculation over a large collection would otherwise run unnecessarily.

`useMemo` is a performance tool, not a state management tool.

## Example Used In This Folder

`UseMemoExample.tsx` filters and sorts candidate data based on selected criteria. The shortlisted result is recalculated only when `minimumScore` or `onlyReact` changes.

## Common Interview Questions

What problem does `useMemo` solve?

It avoids recalculating expensive derived values on every render when the inputs have not changed.

Should we use `useMemo` everywhere?

No. Overusing it adds complexity and can be slower than simply recalculating cheap values.

Is `useMemo` guaranteed forever?

React may discard memoized values, so code should still be correct without relying on it for business logic.

## Common Mistakes

Memoizing simple values that are cheap to compute.

Missing dependencies.

Using `useMemo` to hide inefficient component design.

## Best Practices

Start without memoization.

Add `useMemo` when there is a measurable cost or a clear referential stability need.

Keep dependencies accurate.

## Quick Revision Notes

Memoizes calculated values.

Use for expensive derived data.

Do not use it by default.
