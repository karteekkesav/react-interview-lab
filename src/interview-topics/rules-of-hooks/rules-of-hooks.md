# Rules Of Hooks

## Interview Definition

Hooks must be called at the top level of React function components or custom hooks, and they must not be called inside loops, conditions, nested functions, or regular JavaScript functions.

## Deep Explanation

React relies on the order of hook calls to connect state and effects to the correct component instance. If hooks are called conditionally, the order can change between renders and React can attach state to the wrong hook.

The two core rules are: only call hooks at the top level, and only call hooks from React function components or custom hooks.

## Example Used In This Folder

`RulesOfHooksExample.tsx` defines a custom hook named `useInterviewProgress`. Both the custom hook and the component call hooks at the top level.

## Common Interview Questions

Why can't hooks be called conditionally?

Because React depends on the same hook call order on every render.

Can hooks be called in normal functions?

No. Hooks should be called from React components or custom hooks.

Why do custom hooks start with `use`?

The naming convention helps React tooling detect and enforce hook rules.

## Common Mistakes

Calling `useEffect` after an early return.

Calling hooks inside event handlers.

Calling hooks inside array `map`.

## Best Practices

Call hooks before conditional returns.

Move reusable hook logic into custom hooks.

Let the lint rule guide hook dependencies and placement.

## Quick Revision Notes

Hooks rely on call order.

Top-level calls only.

React components and custom hooks only.
