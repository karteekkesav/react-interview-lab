# State

## Interview Definition

State is component-owned data that can change over time. When state changes, React re-renders the component so the UI reflects the latest value.

## Deep Explanation

Use state for values that affect what the user sees and that can change because of user actions, API responses, timers, or other events.

In function components, `useState` returns the current state value and a setter function. You should update state using the setter, not by mutating the existing value directly.

## Example Used In This Folder

`StateExample.tsx` stores the selected movie filter in state. Clicking a filter button updates state, and React re-renders the movie list.

This is interview-friendly because it shows derived rendering: the filtered list is calculated from existing state and data instead of stored as separate duplicated state.

## Common Interview Questions

When should you use state?

Use state when data changes over time and the UI must update when it changes.

Why should state not be mutated directly?

React relies on state updates to know when to re-render. Direct mutation can create stale UI and unpredictable behavior.

What is derived state?

Derived state is data calculated from existing props or state. It usually should be computed during render instead of stored separately.

## Common Mistakes

Storing values in state that can be calculated from other values.

Mutating arrays or objects directly.

Expecting state updates to be immediately reflected in the same synchronous line of code.

## Best Practices

Keep state minimal.

Use functional state updates when the next value depends on the previous value.

Prefer derived values over duplicated state.

## Quick Revision Notes

State belongs to a component.

Changing state triggers a re-render.

Do not mutate state directly.
