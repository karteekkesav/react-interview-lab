# Mock Service Worker MSW

## Interview Definition

MSW mocks network requests so tests and local development can use realistic API behavior without depending on a real backend.

## Deep Explanation

MSW intercepts requests at the network layer. This is different from mocking fetch functions directly, and it keeps app code closer to production behavior.

## Example Used In This Folder

`MswConceptsExample.tsx` lists handlers that would represent mocked API endpoints.

## Common Interview Questions

Why use MSW?

To test real request flows while controlling API responses.

How is it different from mocking functions?

It intercepts network requests instead of replacing app internals.

Where can MSW run?

In browser development with a service worker and in tests with a node request interceptor.

## Common Mistakes

Mocking implementation details.

Forgetting error and loading handlers.

Letting mock data drift from real API contracts.

## Best Practices

Mock at the network boundary.

Create success and failure handlers.

Keep fixtures realistic.

## Quick Revision Notes

MSW mocks network requests.

Good for tests and local dev.

Mock success and failure states.
