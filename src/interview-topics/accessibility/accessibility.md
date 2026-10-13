# Accessibility

## Interview Definition

Accessibility means building UI that people can use with keyboards, screen readers, different input devices, and assistive technologies.

## Deep Explanation

React does not make inaccessible UI accessible automatically. You still need semantic HTML, labels, keyboard support, focus management, color contrast, and ARIA only when needed.

## Example Used In This Folder

`AccessibilityExample.tsx` uses a real label, required input, submit button, and a polite live region for status feedback.

## Common Interview Questions

What is the first rule of accessibility?

Use semantic HTML before adding custom ARIA.

How do labels help?

They give form fields accessible names and improve click targets.

What is `aria-live`?

It tells assistive technologies to announce dynamic content changes.

## Common Mistakes

Using divs as buttons.

Removing focus outlines.

Adding ARIA where semantic HTML would work better.

## Best Practices

Use semantic elements.

Support keyboard navigation.

Test with labels, roles, and focus behavior.

## Quick Revision Notes

Semantic HTML first.

Labels matter.

Keyboard users matter.
