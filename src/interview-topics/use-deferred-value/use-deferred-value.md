# useDeferredValue

## Interview Definition

`useDeferredValue` returns a deferred version of a value, allowing expensive UI based on that value to lag behind urgent updates.

## Deep Explanation

It is useful when the source value should update immediately, but rendering all dependent UI can wait. Search results, previews, and expensive derived lists are common examples.

## Example Used In This Folder

`UseDeferredValueExample.tsx` updates the input immediately while the filtered results use a deferred query.

## Common Interview Questions

How is `useDeferredValue` different from debounce?

Debounce waits for a fixed time. `useDeferredValue` lets React schedule lower-priority rendering.

Does deferred value skip updates?

No. It lags behind when React is busy.

When should you use it?

When expensive rendering should not block urgent input updates.

## Common Mistakes

Using it as a replacement for API debounce.

Expecting fixed timing behavior.

Deferring values that are not expensive to render.

## Best Practices

Use it for expensive UI rendering.

Show stale-result feedback if useful.

Use debounce separately for network request control.

## Quick Revision Notes

Deferred value can lag.

Good for expensive rendering.

Not the same as debounce.
