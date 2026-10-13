# React Server Components

## Interview Definition

React Server Components render on the server and can produce UI without shipping their component JavaScript to the browser.

## Deep Explanation

Server Components are useful for data-heavy UI, secure server-only access, and reducing client bundle size. They cannot use client-only hooks like `useState`, `useEffect`, or browser event handlers.

Client Components are still needed for interactivity.

## Example Used In This Folder

`ReactServerComponentsExample.tsx` is a client-side simulation that lists the main traits. In a real RSC framework, the server component would run on the server.

## Common Interview Questions

Can Server Components use `useState`?

No. Interactive state belongs in Client Components.

Why use Server Components?

To keep data access on the server and reduce client JavaScript.

Are Server Components the same as SSR?

No. SSR renders HTML. Server Components define a server/client component model.

## Common Mistakes

Putting event handlers in Server Components.

Assuming all components should be server components.

Passing non-serializable values across server/client boundaries.

## Best Practices

Use Server Components for data-heavy non-interactive UI.

Use Client Components for interactivity.

Keep server/client boundaries explicit.

## Quick Revision Notes

Server Components run on the server.

They reduce client JavaScript.

Interactivity needs Client Components.
