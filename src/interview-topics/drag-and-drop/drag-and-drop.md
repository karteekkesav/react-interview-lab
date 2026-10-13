# Drag And Drop

## Interview Definition

Drag and drop lets users move items or files by dragging them from one place to another.

## Deep Explanation

React can use browser drag events for simple cases. More complex production UIs often use libraries because accessible drag and drop, keyboard support, collision detection, and touch support are difficult.

## Example Used In This Folder

`DragAndDropExample.tsx` reorders tasks with stable IDs and browser drag events.

## Common Interview Questions

What state is needed for reorder drag and drop?

The list order and the currently dragged item ID.

Why use stable IDs?

Stable IDs keep item identity correct when order changes.

Would you use native drag events in production?

For simple desktop cases, maybe. For complex accessible interactions, a proven library is usually better.

## Common Mistakes

Using array indexes as item identity.

Forgetting `event.preventDefault()` on drag over.

Ignoring keyboard and touch support.

## Best Practices

Use stable IDs.

Keep reorder logic pure and predictable.

Use libraries for complex accessible drag and drop.

## Quick Revision Notes

Track dragged ID.

Reorder immutable arrays.

Accessibility is the hard part.
