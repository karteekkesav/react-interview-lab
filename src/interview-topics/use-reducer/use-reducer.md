# useReducer

## Interview Definition

`useReducer` manages state with a reducer function and dispatched actions. It is useful when state transitions are related or more complex than simple setter calls.

## Deep Explanation

A reducer receives the current state and an action, then returns the next state. This keeps state transition logic centralized and explicit.

`useReducer` is often a good fit for multi-step forms, complex toggles, grouped state, or state machines.

## Example Used In This Folder

`UseReducerExample.tsx` manages a three-step interview form. Actions such as `next`, `back`, `toggleTerms`, and `reset` describe what happened, while the reducer decides how state changes.

## Common Interview Questions

When should you use `useReducer` instead of `useState`?

Use `useReducer` when state has multiple related fields or when transitions are easier to express as actions.

What should a reducer return?

A reducer should return the next state without mutating the existing state.

Is `useReducer` Redux?

No. It uses the reducer pattern inside a component. Redux is a separate global state management library.

## Common Mistakes

Mutating state inside the reducer.

Using vague action names like `update`.

Choosing `useReducer` for simple independent values where `useState` is clearer.

## Best Practices

Use explicit action types.

Keep reducers pure.

Use TypeScript union types to make actions safer.

## Quick Revision Notes

Reducer equals state plus action to next state.

Dispatch describes what happened.

Reducers should be pure.
