# useId

## Interview Definition

`useId` generates stable unique IDs that are useful for accessibility relationships such as labels, inputs, hints, and error messages.

## Deep Explanation

`useId` helps avoid hardcoded duplicate IDs when a component appears multiple times. It is especially useful for reusable form components.

Do not use `useId` for list keys. Keys should come from data identity.

## Example Used In This Folder

`UseIdExample.tsx` connects a label, input, and hint text with generated IDs.

## Common Interview Questions

What is `useId` used for?

Stable IDs for accessibility attributes.

Should `useId` be used as a key?

No. List keys should come from stable data IDs.

Why not hardcode IDs?

Reusable components can appear multiple times and duplicate IDs break accessibility.

## Common Mistakes

Using it for list keys.

Hardcoding IDs inside reusable components.

Forgetting `htmlFor` and `aria-describedby`.

## Best Practices

Use it in reusable form fields.

Connect labels and descriptions.

Keep data IDs for keys.

## Quick Revision Notes

Stable generated IDs.

Great for accessibility.

Not for list keys.
