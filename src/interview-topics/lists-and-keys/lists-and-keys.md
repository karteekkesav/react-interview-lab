# Lists And Keys

## Interview Definition

Lists render repeated UI from arrays. Keys are stable identifiers that help React match each rendered item with the correct data item between renders.

## Deep Explanation

When rendering arrays with `map`, React needs a `key` for each item. The key should be stable, unique among siblings, and tied to the data identity.

Keys are not passed as normal props. React uses them internally during reconciliation.

## Example Used In This Folder

`ListsAndKeysExample.tsx` renders interview preparation tasks. Each task uses its `id` as the key. When the first item moves to the end, React can preserve each item correctly because the key follows the data item.

## Common Interview Questions

Why are keys needed in React lists?

Keys help React identify which items were added, removed, or reordered.

Can we use array index as a key?

Only for static lists that never reorder, insert, or delete items. For dynamic lists, index keys can cause incorrect UI state.

Are keys globally unique?

No. Keys only need to be unique among siblings in the same list.

## Common Mistakes

Using array index keys for sortable or editable lists.

Generating random keys during render, which forces React to recreate items every time.

Forgetting keys on fragments returned from a list.

## Best Practices

Use database ids or stable domain ids.

Keep list rendering readable by extracting item components when markup grows.

Do filtering and sorting before mapping when it improves clarity.

## Quick Revision Notes

Use `map` to render arrays.

Keys preserve item identity.

Prefer stable ids over indexes.
