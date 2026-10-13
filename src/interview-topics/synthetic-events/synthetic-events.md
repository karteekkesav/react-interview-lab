# Synthetic Events

## Interview Definition

Synthetic events are React's normalized event objects that wrap browser events and provide a consistent API across browsers.

## Deep Explanation

React event handlers receive event objects with familiar properties like `type`, `target`, `currentTarget`, and methods like `preventDefault` and `stopPropagation`.

In TypeScript, handlers are typed with React event types such as `React.ChangeEvent<HTMLInputElement>`.

## Example Used In This Folder

`SyntheticEventsExample.tsx` reads the event type and input value from a typed change event.

## Common Interview Questions

Why does React use synthetic events?

To provide a consistent event API across browsers.

What is the difference between `target` and `currentTarget`?

`target` is where the event originated. `currentTarget` is the element whose handler is currently running.

How do you type input events?

Use `React.ChangeEvent<HTMLInputElement>` for input change handlers.

## Common Mistakes

Using `any` for event handlers.

Confusing `target` and `currentTarget`.

Calling handlers during render instead of passing function references.

## Best Practices

Type event handlers in TSX.

Use `currentTarget` when you need the handler element.

Keep event logic focused and small.

## Quick Revision Notes

React normalizes events.

Type handlers with React event types.

`target` and `currentTarget` are different.
