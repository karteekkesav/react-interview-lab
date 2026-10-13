# Environment Variables

## Interview Definition

Environment variables configure an app for different environments such as development, staging, and production.

## Deep Explanation

In Vite, only variables prefixed with `VITE_` are exposed to browser code. This is important because frontend environment variables are bundled into client JavaScript and are not secret.

## Example Used In This Folder

`EnvironmentVariablesExample.tsx` reads `import.meta.env.MODE` and `VITE_API_BASE_URL`.

## Common Interview Questions

Can frontend environment variables store secrets?

No. Anything in a browser bundle can be inspected by users.

Why does Vite require the `VITE_` prefix?

To explicitly choose which variables are exposed to client code.

When are these values applied?

Usually at build time for static frontend bundles.

## Common Mistakes

Putting API secrets in frontend env vars.

Forgetting the `VITE_` prefix.

Assuming build-time config can change after deployment without a rebuild.

## Best Practices

Never expose secrets in frontend code.

Use backend services for secret operations.

Keep environment-specific config explicit.

## Quick Revision Notes

Frontend env vars are public.

Vite exposes `VITE_` variables.

Build-time config often requires rebuilds.
