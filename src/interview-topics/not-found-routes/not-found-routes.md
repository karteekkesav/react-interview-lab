# 404 Not Found Routes

## Interview Definition

A not-found route handles unknown URLs or invalid paths with a clear fallback screen.

## Deep Explanation

SPAs need both frontend not-found routes and server fallback configuration. Entity detail pages also need invalid ID handling, which is different from unknown route handling.

## Example Used In This Folder

`NotFoundRoutesExample.tsx` uses a `*` route to catch unmatched nested paths.

## Common Interview Questions

What does `path="*"` do?

It catches unmatched routes at that route level.

Is a 404 route enough for deployment?

No. The server must also return `index.html` for client-side routes.

How do you handle invalid IDs?

Render a not-found state for the entity or redirect to a safe route.

## Common Mistakes

Forgetting catch-all routes.

Confusing server 404s with client route 404s.

Showing blank screens for invalid params.

## Best Practices

Add clear fallback UI.

Handle invalid entity IDs separately.

Configure SPA fallback on the host.

## Quick Revision Notes

`*` catches unmatched paths.

Servers need SPA fallback.

Invalid params need their own handling.
