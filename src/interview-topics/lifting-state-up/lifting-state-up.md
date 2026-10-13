# Lifting State Up

## Interview Definition

Lifting state up means moving shared state to the closest common parent so multiple child components can read or update the same source of truth.

## Deep Explanation

When sibling components need to stay in sync, state should not be duplicated in each sibling. The parent owns the state and passes values and callbacks down through props.

This keeps data flow predictable: state lives in one place, and children request updates through callbacks.

## Example Used In This Folder

`LiftingStateUpExample.tsx` has two sibling components. `SearchBox` updates the query, and `ResultSummary` displays the same query. The shared state lives in their parent.

## Common Interview Questions

When should state be lifted up?

When two or more components need to share or coordinate the same state.

What is the downside of lifting state too high?

It can cause unnecessary re-renders and make unrelated components depend on state they do not need.

Is lifting state the same as global state?

No. Lift state only to the closest common parent, not automatically to a global store.

## Common Mistakes

Duplicating the same state in sibling components.

Lifting state all the way to the app root unnecessarily.

Forgetting to pass callbacks for child updates.

## Best Practices

Find the closest common owner.

Keep state local until sharing is needed.

Pass clear callback props like `onQueryChange`.

## Quick Revision Notes

Shared state belongs in a common parent.

One source of truth.

Callbacks update parent-owned state.
