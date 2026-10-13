# Authentication Flow

## Interview Definition

Authentication flow models how a user logs in, logs out, restores a session, and accesses authenticated screens.

## Deep Explanation

A real auth flow usually includes login form submission, token or cookie handling, session restoration on refresh, loading state, error state, logout, protected routes, and API authorization.

Frontend auth state improves UX, but backend authorization is the real security layer.

## Example Used In This Folder

`AuthenticationFlowExample.tsx` models guest, loading, and authenticated states using a discriminated union.

## Common Interview Questions

Where should auth state live?

Usually in an auth provider, app store, or framework session layer.

Is localStorage safe for tokens?

It can be vulnerable to XSS. Many production apps prefer secure HTTP-only cookies depending on architecture.

What happens on page refresh?

The app should restore or validate the session before rendering private content.

## Common Mistakes

Rendering private UI before auth loading completes.

Treating frontend auth as a security boundary.

Forgetting logout cleanup.

## Best Practices

Represent guest, loading, and authenticated states explicitly.

Protect backend APIs.

Centralize auth logic.

## Quick Revision Notes

Auth has multiple states.

Restore session on refresh.

Backend enforces authorization.
