# Infinite Scroll

## Interview Definition

Infinite scroll loads more items as the user reaches the end of the current list or asks for more content.

## Deep Explanation

In production, infinite scroll is often implemented with server pagination plus an Intersection Observer watching a sentinel element near the bottom of the list.

Interviewers may accept a Load More button first, then ask how you would automate it with Intersection Observer.

## Example Used In This Folder

`InfiniteScrollExample.tsx` uses a Load More button to reveal additional results in pages. This keeps the core state model simple: current page, visible items, and has-more state.

## Common Interview Questions

How would you implement infinite scroll?

Use paginated data, track loading and has-more state, and trigger the next fetch with Intersection Observer.

What edge cases matter?

Duplicate fetches, no more data, loading state, error state, and preserving scroll position.

When is pagination better than infinite scroll?

When users need precise navigation, bookmarking, or comparing positions in a large dataset.

## Common Mistakes

Fetching multiple pages at once accidentally.

Not handling the end of the list.

Rendering huge lists without virtualization.

## Best Practices

Use a has-more flag.

Prevent duplicate requests.

Virtualize very large lists.

## Quick Revision Notes

Load more pages progressively.

Intersection Observer can automate loading.

Track loading and has-more states.
