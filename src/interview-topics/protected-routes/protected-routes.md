# Protected Routes

## Interview Definition

Protected routes restrict access to private screens and redirect unauthenticated users to a login or access-denied screen.

## Deep Explanation

Client-side protected routes improve user experience, but they are not a security boundary by themselves. Real security must also be enforced by the backend API.

In React Router, protected route logic usually checks auth state and returns either the protected screen or a `Navigate` redirect.

## Example Used In This Folder

`ProtectedRoutesExample.tsx` toggles an authentication flag. If the user is not authenticated, the protected screen redirects to the nested login route.

## Common Interview Questions

Are protected routes enough for security?

No. Backend APIs must still validate authentication and authorization.

What is `Navigate` used for?

It redirects declaratively from one route to another.

Where should auth state live?

Usually in a provider, auth store, or framework session layer, depending on app size.

## Common Mistakes

Relying only on frontend route guards for security.

Not preserving the intended destination after login.

Rendering private content before auth status is known.

## Best Practices

Handle loading, authenticated, and unauthenticated states.

Protect backend APIs.

Keep auth checks centralized.

## Quick Revision Notes

Route guards improve UX.

Backend enforces security.

Use redirects for unauthenticated users.
