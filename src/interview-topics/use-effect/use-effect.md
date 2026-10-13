# useEffect

## Interview Definition

`useEffect` lets a component synchronize with external systems after React renders, such as APIs, timers, subscriptions, browser storage, or document APIs.

## Deep Explanation

Effects run after render. They are not for calculating normal render data. If something can be calculated from props or state, calculate it during render instead of putting it in an effect.

The dependency array tells React when to re-run the effect. Cleanup functions run before the effect re-runs and when the component unmounts.

## Example Used In This Folder

`UseEffectExample.tsx` has two effects.

The first effect debounces user input with `setTimeout` and cleans up the previous timer.

The second effect simulates loading data whenever the debounced query changes.

This shows the most common interview pattern: effect plus dependency array plus cleanup.

## Common Interview Questions

When does `useEffect` run?

It runs after React commits the render to the screen. With dependencies, it re-runs when a dependency changes.

What is the cleanup function used for?

Cleanup removes subscriptions, timers, event listeners, or cancels stale async work.

Can `useEffect` be async directly?

No. The effect callback should not directly be `async` because it must return either nothing or a cleanup function. Define and call an async function inside the effect.

## Common Mistakes

Using effects for derived values.

Leaving dependencies out to silence re-renders.

Forgetting cleanup for timers, subscriptions, and event listeners.

## Best Practices

Use effects only for synchronization with something outside React rendering.

Include all dependencies required by the effect.

Use cleanup whenever the effect starts work that can outlive the current render.

## Quick Revision Notes

Effect runs after render.

Dependencies control re-runs.

Cleanup prevents stale work and leaks.
