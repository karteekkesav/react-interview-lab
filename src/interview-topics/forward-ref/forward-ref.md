# forwardRef

## Interview Definition

`forwardRef` lets a parent pass a ref through a component to a child DOM node or imperative handle.

## Deep Explanation

Refs do not automatically pass through custom components. `forwardRef` explicitly allows that. `useImperativeHandle` can expose a small controlled API instead of exposing the entire DOM node.

This is useful for reusable inputs, focus management, media controls, animations, and design system components.

## Example Used In This Folder

`ForwardRefExample.tsx` exposes `focus` and `clear` methods from `SearchInput` using `forwardRef` and `useImperativeHandle`.

## Common Interview Questions

Why use `forwardRef`?

To let parent components access a child DOM node or controlled imperative API.

What does `useImperativeHandle` do?

It customizes what the parent receives from the ref.

Should refs be used for normal data flow?

No. Use props and state for normal data flow.

## Common Mistakes

Using refs instead of controlled props.

Exposing too many imperative methods.

Forgetting that refs are escape hatches.

## Best Practices

Expose the smallest necessary imperative API.

Use it for focus and integration needs.

Keep declarative props as the default.

## Quick Revision Notes

Refs do not pass through components automatically.

`forwardRef` enables ref passing.

`useImperativeHandle` controls the exposed API.
