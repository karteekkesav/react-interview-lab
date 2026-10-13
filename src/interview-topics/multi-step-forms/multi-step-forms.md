# Multi-Step Forms

## Interview Definition

Multi-step forms, or wizards, split a long form into smaller steps with navigation, validation, and review.

## Deep Explanation

They are useful for onboarding, checkout, profile setup, and complex applications. The key is deciding whether state should be kept in one parent, a reducer, a form library, or persisted between steps.

## Example Used In This Folder

`MultiStepFormsExample.tsx` stores step state and form fields in one parent so steps can share the final data.

## Common Interview Questions

What state does a wizard need?

Current step, form values, validation errors, and sometimes completed step status.

Should you validate every step?

Usually validate the current step before moving forward.

How do you preserve values between steps?

Keep state in the parent or form provider.

## Common Mistakes

Losing data when steps unmount.

Allowing next without validation.

Putting unrelated step logic in one large component.

## Best Practices

Keep shared form state above steps.

Validate step-by-step.

Show progress clearly.

## Quick Revision Notes

Step is state.

Parent owns shared values.

Validate before next.
