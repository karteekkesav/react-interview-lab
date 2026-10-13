# Suspense

## Interview Definition

Suspense lets React show fallback UI while a child component is waiting for something, such as lazy-loaded code or Suspense-enabled data.

## Deep Explanation

Suspense is commonly used with `React.lazy` for code splitting. In modern React ecosystems, some frameworks and data libraries also integrate Suspense for data fetching.

Suspense boundaries are useful because they let you decide which part of the screen should show a fallback instead of blocking the whole app.

## Example Used In This Folder

`SuspenseExample.tsx` uses a delayed lazy component so you can see the fallback before the content appears.

## Common Interview Questions

What does Suspense render while waiting?

It renders the `fallback` prop for the nearest Suspense boundary.

Is Suspense only for code splitting?

No. It is common for code splitting and can also be used by Suspense-enabled data libraries or frameworks.

Where should Suspense boundaries be placed?

Around the smallest useful section that can independently show loading UI.

## Common Mistakes

Wrapping the entire app in one vague fallback.

Assuming every fetch automatically works with Suspense.

Using a fallback that causes layout shifts.

## Best Practices

Use meaningful boundaries.

Keep fallback UI stable.

Use framework or library guidance for Suspense data fetching.

## Quick Revision Notes

Suspense shows fallback UI.

Works with lazy components.

Boundary placement matters.
