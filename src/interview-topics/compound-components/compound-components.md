# Compound Components

## Interview Definition

Compound components are a group of related components that work together through shared internal state, often using Context, while exposing a readable declarative API.

## Deep Explanation

This pattern is common for Tabs, Accordion, Select, Menu, and Modal APIs. The parent owns shared state, and child components consume that state without requiring the user to manually wire every prop.

The goal is flexibility without making the parent component accept dozens of configuration props.

## Example Used In This Folder

`CompoundComponentsExample.tsx` defines `Tabs`, `TabList`, `Tab`, and `TabPanel`. The tab state is shared through context, so each child component understands the current active tab.

## Common Interview Questions

Why use compound components?

They create flexible component APIs where related pieces can be arranged declaratively.

What problem do they solve?

They avoid prop drilling and overly large configuration objects for related UI parts.

Where are compound components commonly used?

Tabs, accordions, menus, modals, and design system primitives.

## Common Mistakes

Using the pattern for simple components that do not need it.

Hiding too much behavior and making the API magical.

Forgetting clear errors when child components are used outside the parent.

## Best Practices

Use context for shared state.

Keep component names clear.

Throw helpful errors for invalid usage.

## Quick Revision Notes

Related components share state.

Context is often used.

Good for flexible design system APIs.
