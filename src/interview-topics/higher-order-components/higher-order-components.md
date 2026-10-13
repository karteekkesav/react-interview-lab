# Higher Order Components

## Interview Definition

A higher-order component is a function that takes a component and returns a new component with added behavior or props.

## Deep Explanation

HOCs were widely used before hooks for cross-cutting concerns such as auth, analytics, data loading, feature flags, and theming. They still appear in older codebases and some libraries.

The important idea is component wrapping: keep the original component focused, and add reusable behavior externally.

## Example Used In This Folder

`HigherOrderComponentsExample.tsx` defines `withCurrentUser`, which injects a `user` prop into `ProfileBadge`.

## Common Interview Questions

What is an HOC?

A function that receives a component and returns an enhanced component.

Are HOCs still common?

Hooks replaced many HOC use cases, but HOCs still exist in legacy code and some libraries.

What are HOC drawbacks?

Wrapper nesting, prop collisions, harder debugging, and TypeScript complexity.

## Common Mistakes

Mutating the wrapped component.

Not forwarding unrelated props.

Creating unclear injected prop names.

## Best Practices

Prefer hooks for new logic reuse when possible.

Use clear HOC names like `withAuth`.

Keep injected props explicit.

## Quick Revision Notes

HOC takes component, returns component.

Adds reusable behavior.

Hooks are often simpler today.
