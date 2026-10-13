# Testing

## Interview Definition

React testing verifies that components behave correctly from the user's perspective: what users see, type, click, and submit.

## Deep Explanation

Modern React tests usually focus on behavior instead of implementation details. React Testing Library encourages queries by accessible roles, labels, and visible text. This makes tests closer to how users interact with the app.

In interviews, you should be able to describe what you would test even if you do not write the full test.

## Example Used In This Folder

`TestingExample.tsx` is a small form with validation. Good tests would verify that the submit button starts disabled, becomes enabled for a valid email, and shows a success message after submit.

## Common Interview Questions

What should you test in a React component?

Test user-visible behavior, important branches, validation, callbacks, and edge cases.

What is the difference between unit and integration tests?

Unit tests focus on small isolated logic. Integration tests verify multiple pieces working together.

Why avoid testing implementation details?

Implementation-detail tests break during harmless refactors even when user behavior still works.

## Example Test Cases

Render the form and find the email field by label.

Type an invalid email and confirm the button is disabled.

Type a valid email, submit, and expect the success message.

## Common Mistakes

Testing state variables directly instead of behavior.

Using brittle selectors when accessible queries would work.

Ignoring error and disabled states.

## Best Practices

Test like a user.

Prefer role, label, and text queries.

Cover important states, not every implementation branch.

## Quick Revision Notes

Behavior matters more than internals.

Use accessible queries.

Test critical user flows.
