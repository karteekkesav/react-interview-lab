# Keys Deep Dive

## Interview Definition

Keys identify elements among siblings so React can preserve state correctly across list changes.

## Deep Explanation

Keys are not just for removing warnings. They affect reconciliation. Stable keys preserve state with the right item. Changing keys intentionally resets state.

## Example Used In This Folder

`KeysDeepDiveExample.tsx` reverses a list with inputs. Because each row uses a stable data ID, typed input state stays with the correct person.

## Common Interview Questions

Why are array index keys risky?

When items reorder or are inserted, state can stick to the wrong visual item.

Can keys reset component state?

Yes. Changing a component's key tells React to treat it as a new instance.

Do keys need to be globally unique?

No. They only need to be unique among siblings.

## Common Mistakes

Using random keys.

Using indexes for dynamic lists.

Assuming keys are passed as normal props.

## Best Practices

Use stable IDs from data.

Use keys intentionally to reset state.

Avoid generating keys during render.

## Quick Revision Notes

Keys preserve identity.

Stable IDs are best.

Changing key resets state.
