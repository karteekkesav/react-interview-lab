# State Colocation

## Interview Definition

State colocation means keeping state as close as possible to the component that uses it.

## Deep Explanation

Colocated state reduces prop drilling, avoids unnecessary parent re-renders, and makes components easier to reason about. Lift state only when another component needs to share or coordinate that state.

## Example Used In This Folder

`StateColocationExample.tsx` has two independent counters. Each owns its own state because no parent or sibling needs it.

## Common Interview Questions

When should state stay local?

When only one component needs it.

When should state be lifted?

When multiple components need to read or update the same value.

Why not put everything in global state?

It increases coupling and can cause broader re-renders and complexity.

## Common Mistakes

Lifting state too early.

Putting form field state in global stores.

Passing state through many layers when composition or context would be better.

## Best Practices

Start local.

Lift state only when sharing is needed.

Keep global state for truly shared app concerns.

## Quick Revision Notes

Closest owner wins.

Local state is simpler.

Lift only when needed.
