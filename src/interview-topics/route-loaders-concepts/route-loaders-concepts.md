# Route Loaders Concepts

## Interview Definition

Route loaders fetch or prepare data at the route level before or during navigation, depending on the router or framework.

## Deep Explanation

Frameworks and data routers can load data before rendering the route, which avoids every component manually starting its own fetch after mount. Loaders can also handle redirects and route-specific errors.

## Example Used In This Folder

`RouteLoadersConceptsExample.tsx` shows the route-loader mental flow without requiring a data-router setup.

## Common Interview Questions

Why use route loaders?

To colocate route data needs with the route and reduce component-level loading waterfalls.

How are loaders different from `useEffect` fetching?

Loaders are route-aware and can run before the component renders. `useEffect` runs after render.

What should loaders handle?

Data fetching, redirects, and route-level error states.

## Common Mistakes

Fetching the same route data in many child components.

Ignoring loader error states.

Using loaders for local UI state.

## Best Practices

Load route-critical data at the route level.

Keep UI-only state in components.

Handle errors and redirects close to the route.

## Quick Revision Notes

Loaders are route-level data hooks.

They reduce waterfalls.

They can redirect or error.
