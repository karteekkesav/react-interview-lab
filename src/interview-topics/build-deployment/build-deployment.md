# Build And Deployment

## Interview Definition

Building a React app converts source code into optimized production assets that can be deployed to a server, CDN, or hosting platform.

## Deep Explanation

For Vite apps, `npm run build` creates a `dist` folder with HTML, CSS, and JavaScript assets. Deployment usually serves those static assets. Client-side routed apps also need fallback routing configuration.

## Example Used In This Folder

`BuildDeploymentExample.tsx` lists a typical deployment pipeline.

## Common Interview Questions

What does `npm run build` do?

It creates optimized production files.

What is the `dist` folder?

The output folder containing deployable static assets.

What issue happens with client-side routing on refresh?

The server may return 404 unless it falls back to `index.html`.

## Common Mistakes

Deploying source files instead of build output.

Forgetting environment variables at build time.

Not configuring SPA fallback routes.

## Best Practices

Run lint and tests before build.

Cache hashed assets aggressively.

Configure fallback routing for SPAs.

## Quick Revision Notes

Build produces static assets.

Deploy `dist`.

SPAs need fallback routing.
