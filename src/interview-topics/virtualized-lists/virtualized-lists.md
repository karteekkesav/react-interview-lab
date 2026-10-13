# Virtualized Lists

## Interview Definition

Virtualized lists render only the visible portion of a large list instead of rendering every item in the DOM.

## Deep Explanation

Rendering thousands of DOM nodes can make scrolling and updates slow. Virtualization keeps the scroll height but only mounts visible rows plus a small buffer.

Production teams often use libraries like `react-window`, `react-virtual`, or data grid virtualization.

## Example Used In This Folder

`VirtualizedListsExample.tsx` simulates a 1000-row list while rendering only the rows visible in a fixed-height viewport.

## Common Interview Questions

Why virtualize lists?

To reduce DOM nodes and improve rendering performance for large lists.

What data is needed?

Scroll offset, row height, viewport height, start index, and visible count.

When should you avoid virtualization?

For small lists where complexity is not worth it.

## Common Mistakes

Rendering all rows and only hiding them with CSS.

Ignoring dynamic row heights.

Breaking keyboard or screen reader navigation.

## Best Practices

Use proven libraries for production.

Measure list performance.

Handle accessibility and dynamic sizes carefully.

## Quick Revision Notes

Render visible rows only.

Keep total scroll height.

Use libraries in real apps.
