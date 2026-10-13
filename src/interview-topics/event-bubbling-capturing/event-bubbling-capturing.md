# Event Bubbling And Capturing

## Interview Definition

Event propagation describes how events travel through the DOM: capturing goes from parent to child, then bubbling goes from child back to parent.

## Deep Explanation

React supports normal bubbling handlers like `onClick` and capture handlers like `onClickCapture`. You can stop propagation with `event.stopPropagation()`, but it should be used intentionally.

## Example Used In This Folder

`EventBubblingCapturingExample.tsx` logs capture and bubble handlers on a parent and child so you can see the order.

## Common Interview Questions

What is event bubbling?

The event starts at the target and bubbles upward through ancestors.

What is event capturing?

The event travels from ancestors down toward the target before the target phase.

How do you stop propagation?

Call `event.stopPropagation()` in the handler.

## Common Mistakes

Stopping propagation unnecessarily.

Forgetting parent handlers also receive bubbled child events.

Confusing capture and bubble order.

## Best Practices

Use propagation for delegated behavior.

Use capture only when you need earlier interception.

Avoid stopping propagation unless there is a clear reason.

## Quick Revision Notes

Capture goes down.

Bubble goes up.

React supports `onClickCapture`.
