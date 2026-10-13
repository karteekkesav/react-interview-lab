# Reusable Modal Pattern

## Interview Definition

A reusable modal pattern separates modal structure from modal content and controls visibility through explicit props.

## Deep Explanation

Good reusable modals usually accept `isOpen`, `onClose`, `title`, and `children`. They often render with portals and handle accessibility details such as dialog roles, focus trapping, escape key, and background interaction.

## Example Used In This Folder

`ReusableModalPatternExample.tsx` creates a modal component controlled by the parent. The parent owns `isOpen` state and passes content through `children`.

## Common Interview Questions

Who should own modal open state?

Usually the parent that decides when the modal should appear.

Why use children for modal content?

It keeps the modal reusable for many different flows.

Why use a portal?

To avoid layout clipping and stacking issues.

## Common Mistakes

Hardcoding modal content.

Hiding open state inside the modal when the parent needs control.

Ignoring accessibility.

## Best Practices

Use controlled open state.

Accept flexible content with children.

Handle focus and keyboard behavior in production.

## Quick Revision Notes

Parent controls visibility.

Modal owns structure.

Children provide content.
