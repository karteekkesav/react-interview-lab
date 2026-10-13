# StrictMode

## Interview Definition

`StrictMode` is a development-only React tool that enables extra checks to find unsafe rendering and effect patterns.

## Deep Explanation

StrictMode can intentionally double-invoke certain render and effect flows in development to reveal missing cleanup and impure rendering. It does not behave this way in production.

## Example Used In This Folder

`StrictModeExample.tsx` uses an effect with cleanup. In development StrictMode, React may run setup and cleanup more than once to verify the effect is resilient.

## Common Interview Questions

Does StrictMode run in production?

No. Its extra checks are development-only.

Why do effects appear to run twice in development?

StrictMode intentionally checks whether effects handle setup and cleanup correctly.

Should you remove StrictMode to fix double effects?

Usually no. Fix the effect cleanup instead.

## Common Mistakes

Assuming double effects happen in production.

Writing effects that cannot safely clean up.

Doing side effects during render.

## Best Practices

Keep StrictMode enabled during development.

Write idempotent effect setup and cleanup.

Use it as a warning system.

## Quick Revision Notes

Development-only checks.

Helps find unsafe effects.

Production behavior is different.
