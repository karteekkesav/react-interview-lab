# Lifecycle Mental Model

## Interview Definition

React function components follow a render and commit model. React renders the next UI, commits DOM changes, then runs effects. Before an effect re-runs or a component unmounts, React runs cleanup.

## Deep Explanation

Class lifecycle methods map loosely to function component behavior, but modern React discussions usually use render, commit, effect, cleanup, and unmount.

Rendering should stay pure. Effects handle synchronization with systems outside rendering.

## Example Used In This Folder

`LifecycleMentalModelExample.tsx` logs effect runs and cleanup when count changes.

## Common Interview Questions

When does `useEffect` run?

After React commits the render to the screen.

When does cleanup run?

Before the effect re-runs and when the component unmounts.

Should render contain side effects?

No. Render should be pure.

## Common Mistakes

Doing API calls directly during render.

Forgetting cleanup for subscriptions and timers.

Thinking state updates immediately mutate the current render.

## Best Practices

Keep render pure.

Use effects only for external synchronization.

Clean up work that outlives a render.

## Quick Revision Notes

Render calculates UI.

Commit updates DOM.

Effects run after commit.
