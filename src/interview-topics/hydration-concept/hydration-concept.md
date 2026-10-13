# Hydration Concept

## Interview Definition

Hydration is the process where React attaches event handlers and interactivity to HTML that was already rendered by the server.

## Deep Explanation

In SSR apps, the user may see HTML before JavaScript finishes loading. Hydration makes that HTML interactive. If the server HTML and client render output do not match, hydration warnings or UI bugs can occur.

## Example Used In This Folder

`HydrationConceptExample.tsx` simulates static HTML becoming interactive after the client effect runs.

## Common Interview Questions

What is hydration?

React attaching client-side behavior to server-rendered HTML.

What is a hydration mismatch?

A mismatch between server-rendered HTML and the client's initial render.

What causes hydration mismatches?

Using browser-only values, random values, dates, or user-specific data differently on server and client.

## Common Mistakes

Reading `window` during server render.

Rendering random IDs without stable APIs.

Showing different markup on server and client initial render.

## Best Practices

Keep initial server and client output consistent.

Use effects for browser-only behavior.

Use framework guidance for SSR data.

## Quick Revision Notes

SSR HTML becomes interactive.

Initial markup must match.

Browser-only logic belongs after mount.
