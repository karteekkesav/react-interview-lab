# SSR Vs CSR Vs SSG

## Interview Definition

CSR, SSR, and SSG are rendering strategies that decide where and when HTML is produced.

## Deep Explanation

Client-side rendering loads a mostly empty HTML shell and renders in the browser. Server-side rendering creates HTML on each request. Static site generation creates HTML at build time.

Frameworks such as Next.js and Remix help combine these strategies depending on the route.

## Example Used In This Folder

`RenderingStrategiesExample.tsx` compares CSR, SSR, and SSG at a high level.

## Common Interview Questions

What is CSR?

The browser downloads JavaScript and renders the UI on the client.

What is SSR?

The server returns rendered HTML for a request.

What is SSG?

HTML is generated at build time and served statically.

## Common Mistakes

Assuming React always means CSR.

Ignoring SEO and first contentful paint tradeoffs.

Using SSR for pages that could be static.

## Best Practices

Choose rendering per route and user need.

Use SSG for stable content.

Use SSR for dynamic SEO-sensitive pages.

## Quick Revision Notes

CSR renders in browser.

SSR renders per request.

SSG renders at build time.
