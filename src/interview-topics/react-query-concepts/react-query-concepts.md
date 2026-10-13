# React Query Concepts

## Interview Definition

React Query, also known as TanStack Query, manages server state: fetching, caching, refetching, retries, stale data, mutations, and invalidation.

## Deep Explanation

Server state is different from client UI state. It lives on the server, can become stale, is shared across screens, and often needs caching and background refetching.

TanStack Query helps avoid rewriting loading, error, cache, retry, and invalidation logic for every API call.

## Example Used In This Folder

`ReactQueryConceptsExample.tsx` does not install TanStack Query. Instead, it demonstrates the mental model: cached data, background fetching, and invalidation/refetch.

## Common Interview Questions

What problem does React Query solve?

It manages server state, including caching, loading states, retries, stale data, and invalidation.

How is server state different from client state?

Server state is remote, asynchronous, shared, and can become stale.

What is query invalidation?

Marking cached data as stale so it can be refetched.

## Common Mistakes

Putting server cache data into global client stores manually.

Refetching everything unnecessarily.

Ignoring stale time and cache time concepts.

## Best Practices

Use query keys consistently.

Invalidate related queries after mutations.

Keep client UI state separate from server state.

## Quick Revision Notes

Server state is remote and cacheable.

Queries read data.

Mutations change data and often invalidate queries.
