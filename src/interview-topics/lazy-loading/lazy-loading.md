# Lazy Loading

## Interview Definition

Lazy loading means loading code or assets only when they are needed instead of including everything in the initial bundle.

## Deep Explanation

React supports component-level code splitting with `lazy` and `Suspense`. This is useful for large routes, dashboards, admin screens, charts, editors, and rarely used flows.

Lazy loading improves initial load performance but can add waiting time when the user first opens the lazy section.

## Example Used In This Folder

`LazyLoadingExample.tsx` loads a panel only after the user clicks a button. The panel is wrapped in `Suspense` so React can show fallback UI while it loads.

## Common Interview Questions

What does `React.lazy` do?

It lets you render a component that is loaded dynamically.

Why do lazy components need Suspense?

Suspense provides fallback UI while the lazy component is loading.

Where is lazy loading most useful?

For route-level screens or heavy features that are not needed immediately.

## Common Mistakes

Lazy loading tiny components without benefit.

Forgetting fallback UI.

Creating too many small chunks.

## Best Practices

Lazy load heavy routes and rarely used features.

Keep fallback UI simple and useful.

Measure bundle impact when optimizing.

## Quick Revision Notes

Lazy loading reduces initial bundle work.

Use `lazy` plus `Suspense`.

Best for heavy screens.
