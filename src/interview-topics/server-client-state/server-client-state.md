# Server State Vs Client State

## Interview Definition

Server state is remote data owned by the backend. Client state is local UI state owned by the frontend.

## Deep Explanation

Server state is asynchronous, shared, cacheable, and can become stale. Client state includes selected tabs, modal open state, form drafts, and UI filters.

Mixing these concepts often leads to unnecessary global stores and manual cache bugs.

## Example Used In This Folder

`ServerClientStateExample.tsx` treats the movie list as server state and the selected movie ID as client state.

## Common Interview Questions

What is server state?

Remote data fetched from APIs.

What is client state?

Local UI state such as selection, toggles, drafts, and view state.

Why use React Query?

To manage server state caching, refetching, stale data, and mutations.

## Common Mistakes

Copying server data into global client stores without a cache strategy.

Using API state as if it never becomes stale.

Storing derived server data separately.

## Best Practices

Use data fetching libraries for server state.

Keep UI state local when possible.

Separate cache concerns from view concerns.

## Quick Revision Notes

Server state is remote.

Client state is UI-owned.

They need different tools.
