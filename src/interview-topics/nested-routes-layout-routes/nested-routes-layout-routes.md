# Nested Routes And Layout Routes

## Interview Definition

Nested routes render child screens inside a parent route. Layout routes share UI such as navigation, sidebars, or page frames across related child routes.

## Deep Explanation

React Router uses `Outlet` as the placeholder where matched child routes render. Layout routes help avoid repeating wrappers across many screens.

## Example Used In This Folder

`NestedRoutesLayoutRoutesExample.tsx` creates a settings layout with profile and security child routes.

## Common Interview Questions

What is `Outlet`?

It renders the matched child route inside a parent route.

Why use layout routes?

To share layout and navigation across related screens.

When use nested routes?

For dashboards, settings, details pages, and app sections with sub-pages.

## Common Mistakes

Repeating layout markup in every route.

Forgetting index routes for parent paths.

Using nested routes when simple state would be clearer.

## Best Practices

Use layouts for shared frames.

Add index routes for default child content.

Keep route structure aligned with product structure.

## Quick Revision Notes

Parent route owns layout.

`Outlet` renders children.

Index route is the default child.
