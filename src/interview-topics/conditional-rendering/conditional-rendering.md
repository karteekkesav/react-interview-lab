# Conditional Rendering

## Interview Definition

Conditional rendering means showing different UI based on state, props, or computed conditions.

## Deep Explanation

Real React apps rarely have only one UI state. They usually need loading, empty, error, and success states. Being able to model these states clearly is important in interviews and machine coding rounds.

Common patterns include `if` returns before JSX, ternary expressions, logical `&&`, and mapping a state value to a component.

## Example Used In This Folder

`ConditionalRenderingExample.tsx` switches between loading, empty, error, and success UI. This mirrors how API screens are usually discussed in interviews.

## Common Interview Questions

What are common ways to conditionally render UI?

Use early returns, ternary expressions, logical `&&`, or state-based component maps.

When should you use early return?

Use early return when a whole component should display a different state, such as loading or error.

What is a common issue with `&&` rendering?

If the left side is `0`, React may render `0`. Use explicit boolean checks when needed.

## Common Mistakes

Handling only success UI and forgetting loading, empty, and error states.

Creating deeply nested ternaries that are hard to read.

Using truthy checks when valid values like `0` should still render.

## Best Practices

Model UI states explicitly.

Prefer readable conditions over clever expressions.

Keep loading, empty, error, and success states easy to identify.

## Quick Revision Notes

Conditional UI depends on state or props.

Real apps need loading, empty, error, and success views.

Avoid unreadable nested ternaries.
