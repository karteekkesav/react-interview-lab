# State Management

## Interview Definition

State management is the decision of where state should live, how it should update, and which parts of the app should be able to read or change it.

## Deep Explanation

React gives you several levels of state management. Use local state for component-only data. Lift state up when siblings need to share it. Use context for app-level values. Use reducers for complex transitions. Use external libraries when state is shared widely, server cached, or operationally complex.

Strong interview answers explain tradeoffs instead of naming one tool for everything.

## Example Used In This Folder

`StateManagementExample.tsx` manages a task list with `useReducer`. The reducer centralizes update logic, while derived data calculates completed task count.

## Common Interview Questions

How do you decide where state should live?

Put state at the lowest common owner that needs to read or update it.

When do you use Context?

Use Context for values needed by many nested components, such as auth, theme, locale, or app settings.

When do you use an external state library?

Use one when shared client state becomes complex, when many unrelated screens need it, or when the team needs predictable tooling patterns.

## Common Mistakes

Putting all state in global stores.

Duplicating derived state.

Using Context for high-frequency local updates.

## Best Practices

Keep state as local as possible.

Lift state only when needed.

Separate server state from client UI state.

## Quick Revision Notes

State location depends on scope.

Local state first.

Use reducers for complex transitions.
