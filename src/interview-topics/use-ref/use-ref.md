# useRef

## Interview Definition

`useRef` stores a mutable value that persists across renders without causing a re-render when it changes.

## Deep Explanation

Refs are commonly used for DOM access, storing timer ids, preserving previous values, or keeping mutable values that should not affect rendered output.

Changing `ref.current` does not trigger a re-render. If a value should update the UI, use state instead.

## Example Used In This Folder

`UseRefExample.tsx` uses one ref to focus an input DOM node and another ref to store a render count.

This demonstrates the two most common interview points: DOM access and persistent mutable values.

## Common Interview Questions

How is `useRef` different from `useState`?

State updates trigger re-renders. Ref updates do not.

When would you use `useRef`?

For DOM access, timer ids, previous values, or mutable values that should persist without re-rendering.

Can refs be used to avoid re-renders?

Yes, but only for values that do not need to be reflected directly in the UI.

## Common Mistakes

Using refs for data that should be visible in the UI.

Reading or writing DOM nodes before they exist.

Treating ref changes like state updates.

## Best Practices

Use state for UI data.

Use refs for DOM access and non-rendering mutable values.

Keep imperative ref usage small and intentional.

## Quick Revision Notes

Refs persist across renders.

Updating refs does not re-render.

Refs are useful for DOM access.
