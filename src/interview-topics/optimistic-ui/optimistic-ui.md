# Optimistic UI

## Interview Definition

Optimistic UI updates the interface immediately before the server confirms success, then either confirms the update or rolls it back if the request fails.

## Deep Explanation

Optimistic UI makes apps feel faster for actions that usually succeed, such as likes, saves, follows, or adding comments. The challenge is handling failures, duplicate actions, disabled states, and reconciliation with server data.

## Example Used In This Folder

`OptimisticUiExample.tsx` adds a comment immediately with `saving` status. On success, the comment becomes `saved`. On failure, it is removed.

## Common Interview Questions

When should you use optimistic UI?

For low-risk actions that usually succeed and where instant feedback improves UX.

What happens if the server fails?

Rollback the optimistic update, show an error, or mark the item as failed.

What libraries help with optimistic updates?

TanStack Query, Apollo Client, Redux Toolkit Query, and similar data libraries.

## Common Mistakes

Not handling rollback.

Using optimistic UI for high-risk destructive actions without confirmation.

Not preventing duplicate submissions.

## Best Practices

Keep rollback logic clear.

Show pending or failed state when useful.

Reconcile with server data after mutation settles.

## Quick Revision Notes

Update first, confirm later.

Rollback on failure.

Best for low-risk frequent actions.
