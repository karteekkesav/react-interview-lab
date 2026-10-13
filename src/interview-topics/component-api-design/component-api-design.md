# Component API Design

## Interview Definition

Component API design is the process of choosing props, defaults, composition points, and constraints that make a component easy to use and hard to misuse.

## Deep Explanation

A good component API balances flexibility and simplicity. Too few props make a component rigid. Too many flags make it confusing. Composition with `children` or ReactNode slots is often better than many boolean variations.

In interviews, this topic helps show production maturity.

## Example Used In This Folder

`ComponentApiDesignExample.tsx` defines `EmptyState` with explicit text props and an optional `action` slot. This is clearer than many booleans like `showButton`, `isInterview`, or `hasAction`.

## Common Interview Questions

What makes a good reusable component?

Clear responsibility, typed props, sensible defaults, accessible markup, and flexible composition points.

When should a prop be a boolean?

When it represents a true binary state. Avoid many booleans that create unclear combinations.

When should you use `children` or ReactNode props?

When the caller needs to provide flexible UI content.

## Common Mistakes

Adding too many boolean props.

Making components too generic too early.

Mixing business logic into low-level UI components.

## Best Practices

Design for the known use cases first.

Prefer explicit names.

Use composition for flexible regions.

## Quick Revision Notes

Good APIs are clear and constrained.

Avoid boolean prop explosions.

Use slots for flexible content.
