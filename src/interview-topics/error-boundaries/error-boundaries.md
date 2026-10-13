# Error Boundaries

## Interview Definition

Error boundaries are React components that catch rendering errors in their child tree and display fallback UI instead of crashing the whole app.

## Deep Explanation

Error boundaries catch errors during rendering, lifecycle methods, and constructors below them. Traditionally, they are class components because React exposes `getDerivedStateFromError` and `componentDidCatch` for this behavior.

They do not catch errors in event handlers, async callbacks, or server-side rendering.

## Example Used In This Folder

`ErrorBoundariesExample.tsx` wraps a risky child widget in an `ErrorBoundary`. When the child throws during render, the boundary shows fallback UI.

## Common Interview Questions

What do error boundaries catch?

They catch render-time errors in child components.

Do error boundaries catch event handler errors?

No. Event handler errors should be handled with normal try/catch or error reporting logic.

Where should error boundaries be placed?

Around sections where failure should be isolated, such as routes, widgets, or complex panels.

## Common Mistakes

Expecting boundaries to catch async errors.

Putting only one global boundary and losing useful section-level recovery.

Not logging errors from `componentDidCatch`.

## Best Practices

Use boundaries around route sections or risky feature areas.

Show helpful fallback UI.

Report caught errors to monitoring tools in production.

## Quick Revision Notes

Error boundaries catch render errors.

They are usually class components.

They do not catch event handler or async errors.
