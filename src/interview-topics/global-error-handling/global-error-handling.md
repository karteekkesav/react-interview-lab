# Global Error Handling

## Interview Definition

Global error handling centralizes how an app reports errors, shows fallback UI, and recovers from unexpected failures.

## Deep Explanation

React apps usually combine several techniques: error boundaries for render errors, try/catch for event handlers, API error handling for requests, and monitoring tools for production reporting.

## Example Used In This Folder

`GlobalErrorHandlingExample.tsx` simulates a handled event error, shows a user-friendly message, and logs where production monitoring would happen.

## Common Interview Questions

Do error boundaries catch every error?

No. They catch render errors, not event handler or async callback errors.

How should API errors be handled?

Represent error state, show useful UI, and log/report when appropriate.

What should users see?

Helpful recovery-oriented messages, not raw stack traces.

## Common Mistakes

Showing technical errors to users.

Only logging errors without UI feedback.

Expecting one error boundary to solve every error case.

## Best Practices

Use error boundaries for UI crashes.

Handle async and event errors explicitly.

Report production errors with useful context.

## Quick Revision Notes

Different errors need different handling.

User message plus developer logging.

Error boundaries are only one layer.
