# Fragments

## Interview Definition

Fragments let a component return multiple JSX elements without adding an extra DOM wrapper.

## Deep Explanation

Fragments are useful when adding a wrapper would break layout, semantics, tables, lists, or definition lists. The shorthand syntax is `<>...</>`. Use `<React.Fragment key={...}>` when mapping keyed fragments.

## Example Used In This Folder

`FragmentsExample.tsx` returns paired `dt` and `dd` elements from a child component without adding an invalid wrapper inside `dl`.

## Common Interview Questions

Why use fragments?

To group JSX without extra DOM nodes.

Can shorthand fragments have keys?

No. Use `<React.Fragment key={id}>` for keyed fragments.

When do extra wrappers cause problems?

Tables, lists, definition lists, CSS grids, and semantic HTML structures.

## Common Mistakes

Adding unnecessary div wrappers.

Using shorthand fragments where a key is needed.

Breaking semantic HTML with wrapper elements.

## Best Practices

Use fragments for grouping only.

Use keyed fragments when mapping multiple siblings.

Avoid unnecessary DOM depth.

## Quick Revision Notes

Fragments do not render DOM nodes.

Shorthand is `<>`.

Keyed fragments need `React.Fragment`.
