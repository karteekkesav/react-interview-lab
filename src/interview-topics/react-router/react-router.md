# React Router

## Interview Definition

React Router lets a React app render different UI for different URLs without doing a full page reload.

## Deep Explanation

Modern React apps often use client-side routing for pages like dashboard, details, profile, and settings. React Router provides route matching, navigation links, route params, nested routes, redirects, and layout routes.

In interviews, you should explain that routing is UI state represented by the URL. Good routing makes screens bookmarkable, shareable, and easier to reason about.

## Example Used In This Folder

`ReactRouterExample.tsx` uses nested routes inside the example page. Clicking a movie link updates the nested URL segment and `useParams` reads the `movieId`.

This mirrors a common interview task: list page plus details page.

## Common Interview Questions

What is client-side routing?

Client-side routing changes the rendered React screen based on the URL without requesting a new HTML document from the server.

What is `useParams` used for?

It reads dynamic path values such as `/movies/:movieId`.

What is the difference between `Link` and an anchor tag?

`Link` performs React Router navigation without a full page reload. A normal anchor can trigger a document navigation.

## Common Mistakes

Using state for page identity when the URL should represent it.

Forgetting to handle invalid route params.

Using regular anchors for internal navigation.

## Best Practices

Use routes for bookmarkable screens.

Use route params for entity details pages.

Keep route layouts predictable and handle not-found states.

## Quick Revision Notes

URL drives the current screen.

Use `Link` for internal navigation.

Use `useParams` for dynamic route values.
