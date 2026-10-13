# API Calls

## Interview Definition

API calls in React are asynchronous operations where a component requests data and renders loading, success, empty, or error UI based on the result.

## Deep Explanation

The key interview skill is not just calling `fetch`. It is managing the whole user experience around the request: loading states, failures, empty data, stale requests, and cleanup.

For production apps, teams often use libraries such as TanStack Query, SWR, Redux Toolkit Query, or framework loaders. Still, you should understand the manual `useEffect` pattern.

## Example Used In This Folder

`ApiCallsExample.tsx` simulates a movie API request. It uses a discriminated union for request state, renders different UI for each state, and ignores stale async responses during cleanup.

## Common Interview Questions

Where do you usually call APIs in React?

For basic component-level fetching, inside `useEffect`. In larger apps, use data fetching libraries or framework-level loaders.

Why do we need loading and error states?

Because network requests are asynchronous and can fail. The UI should communicate what is happening.

How do you avoid setting state after a component unmounts?

Use cleanup logic, abort controllers, or a data fetching library that handles cancellation and stale responses.

## Common Mistakes

Only handling the success case.

Not cleaning up stale requests.

Putting async directly on the effect callback.

## Best Practices

Represent request states explicitly.

Handle loading, empty, error, and success.

Use a data fetching library for caching, retries, deduping, and invalidation in real apps.

## Quick Revision Notes

API UI needs multiple states.

Use cleanup for stale async work.

Production apps often use query libraries.
