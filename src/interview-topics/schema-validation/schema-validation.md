# Schema Validation

## Interview Definition

Schema validation defines expected data shape and rules so form input or API data can be checked consistently.

## Deep Explanation

Libraries like Zod and Yup let teams define reusable schemas with typed outputs and structured errors. Validation should happen on both frontend and backend.

## Example Used In This Folder

`SchemaValidationExample.tsx` uses a small custom validator to model schema-style field validation.

## Common Interview Questions

Why use schema validation?

To centralize rules, produce consistent errors, and protect data boundaries.

Is frontend validation enough?

No. Backend validation is required for security and data integrity.

What is Zod commonly used for?

Type-safe validation for forms, API responses, and environment variables.

## Common Mistakes

Only validating on the client.

Showing unclear error messages.

Duplicating validation rules in many places.

## Best Practices

Validate at boundaries.

Show field-specific errors.

Reuse schemas where appropriate.

## Quick Revision Notes

Schemas define data rules.

Frontend validation improves UX.

Backend validation is mandatory.
