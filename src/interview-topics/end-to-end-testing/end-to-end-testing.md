# End-To-End Testing

## Interview Definition

End-to-end tests verify complete user flows in a real or realistic browser environment.

## Deep Explanation

E2E tools like Playwright and Cypress interact with the app like a user: visit pages, click buttons, type text, wait for network/UI changes, and assert outcomes.

## Example Used In This Folder

`EndToEndTestingExample.tsx` shows a login flow that would be tested end to end.

## Common Interview Questions

What should E2E tests cover?

Critical business flows such as login, checkout, onboarding, and important CRUD paths.

How are E2E tests different from component tests?

E2E tests cover the full app flow. Component tests focus on smaller UI units.

Why not test everything with E2E?

They are slower, more expensive, and can be more brittle.

## Common Mistakes

Testing too many tiny details with E2E.

Using arbitrary waits instead of reliable assertions.

Depending on unstable test data.

## Best Practices

Cover critical paths.

Use accessible locators.

Keep tests deterministic.

## Quick Revision Notes

E2E tests full flows.

Use for critical journeys.

Avoid brittle waits.
