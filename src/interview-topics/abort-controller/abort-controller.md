# AbortController Cancellation

## Interview Definition

`AbortController` lets you cancel fetch requests or abortable async work when it is no longer needed.

## Deep Explanation

Cancellation matters when users type new search terms, navigate away, or trigger a newer request before an older one finishes. Without cancellation or stale-response guards, old responses can overwrite newer UI.

## Example Used In This Folder

`AbortControllerExample.tsx` aborts the previous request whenever a new request starts.

## Common Interview Questions

Why cancel API requests?

To avoid wasted work and prevent stale responses from updating the UI.

How does AbortController work with fetch?

Pass `controller.signal` to `fetch`, then call `controller.abort()` in cleanup.

What error happens on abort?

Fetch rejects with an abort-related error, usually named `AbortError`.

## Common Mistakes

Ignoring stale requests.

Treating abort as a real user-facing error.

Forgetting cleanup in effects.

## Best Practices

Abort requests on cleanup.

Ignore abort errors in UI.

Use query libraries when possible.

## Quick Revision Notes

Controller creates signal.

Pass signal to fetch.

Abort in cleanup.
