# Components

## Interview Definition

Components are reusable pieces of UI. In modern React, they are usually functions that receive props and return JSX.

## Deep Explanation

Components help you split a screen into smaller responsibilities. A good component has a clear job, clear props, and predictable rendering.

React components must start with a capital letter so React can distinguish them from built-in HTML elements.

## Example Used In This Folder

`ComponentsExample.tsx` defines a reusable `StatCard` component. The parent component renders two cards by passing different props.

The interview point is composition: larger UIs are built by combining smaller components.

## Common Interview Questions

What is a component in React?

A component is a reusable function that returns UI based on props, state, or context.

What is component composition?

Composition means building complex UIs by combining smaller components instead of creating one large component.

Why should component names start with a capital letter?

React treats lowercase JSX tags as DOM elements and uppercase tags as custom components.

## Common Mistakes

Creating very large components with too many responsibilities.

Passing unclear props like `data` when explicit prop names would be better.

Extracting components too early before a pattern is clear.

## Best Practices

Keep components focused.

Use props as the public contract.

Extract components when it improves readability or reuse.

## Quick Revision Notes

Components return JSX.

Props configure components.

Composition builds larger UIs from smaller pieces.
