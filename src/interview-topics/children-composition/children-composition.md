# Children And Composition

## Interview Definition

Composition means building flexible components by passing JSX as `children` or named props instead of hardcoding every variation.

## Deep Explanation

React favors composition over inheritance. Components can accept `children` for main content and additional ReactNode props for named slots such as actions, header, footer, or sidebar.

This pattern is useful for reusable layout components, cards, modals, dialogs, and design system primitives.

## Example Used In This Folder

`ChildrenCompositionExample.tsx` defines `InterviewPanel`. The panel controls layout, while the parent supplies the inner content and action button.

## Common Interview Questions

What is the `children` prop?

`children` is the JSX placed between a component's opening and closing tags.

Why is composition important?

It creates flexible reusable components without adding too many boolean props.

What are named slots in React?

Named slots are regular props that accept React nodes, such as `actions`, `header`, or `footer`.

## Common Mistakes

Adding too many flags like `isPrimary`, `showFooter`, and `hasActions`.

Hardcoding content inside reusable layout components.

Using composition when a simple prop would be clearer.

## Best Practices

Use `children` for main content.

Use named ReactNode props for specific regions.

Keep reusable components responsible for structure, not business content.

## Quick Revision Notes

React favors composition.

`children` passes JSX.

Named slots are props containing JSX.
