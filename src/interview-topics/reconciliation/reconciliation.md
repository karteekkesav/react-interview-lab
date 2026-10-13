# Reconciliation

## Interview Definition

Reconciliation is React's process of comparing the previous UI tree with the next UI tree and deciding what DOM updates are needed.

## Deep Explanation

React preserves component state when the element type and key match between renders. Keys are especially important in lists because they tell React which item is which after insertions, deletions, or reordering.

## Example Used In This Folder

`ReconciliationExample.tsx` reverses a list with stable keys. Inputs stay associated with the correct item because React can match by key.

## Common Interview Questions

What does React use keys for?

Keys help React match list items across renders.

When does React reset component state?

When the component type or key changes.

Is the virtual DOM the real DOM?

No. It is a representation React uses to decide efficient updates.

## Common Mistakes

Using array index keys in dynamic lists.

Changing keys on every render.

Expecting React to preserve state when keys change.

## Best Practices

Use stable data IDs for keys.

Keep component positions predictable.

Use keys intentionally to reset state when needed.

## Quick Revision Notes

React compares old and new trees.

Type plus key preserves identity.

Bad keys cause state bugs.
