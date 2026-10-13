# Render Props

## Interview Definition

Render props is a pattern where a component receives a function prop and calls it to render UI with shared state or behavior.

## Deep Explanation

Before hooks became common, render props were a popular way to reuse stateful logic. They are still useful to understand because many libraries and advanced APIs use the idea of passing rendering control to the consumer.

The component owns behavior. The caller decides what UI to render.

## Example Used In This Folder

`RenderPropsExample.tsx` defines a `Toggle` component. `Toggle` owns `isOn` state and passes `isOn` plus `toggle` into its child function.

## Common Interview Questions

What problem do render props solve?

They share behavior while letting the consumer control the rendered UI.

Are render props still used after hooks?

Less often, but the pattern still appears in libraries and is useful for flexible component APIs.

What is the downside?

Too many nested render props can make JSX harder to read.

## Common Mistakes

Using render props when a custom hook would be simpler.

Creating deeply nested function children.

Not typing the render function clearly.

## Best Practices

Use render props when the caller needs full control over markup.

Prefer custom hooks for simple logic reuse.

Keep function arguments small and well named.

## Quick Revision Notes

Behavior owner calls a render function.

Caller controls UI.

Hooks replaced many render prop use cases.
