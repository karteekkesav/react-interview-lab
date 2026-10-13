# Accordion Pattern

## Interview Definition

An accordion shows expandable sections where each header controls the visibility of its panel.

## Deep Explanation

Accordions can allow one open item or multiple open items. Good implementations use buttons for headers, manage expanded state, and provide accessible relationships with ARIA in production.

## Example Used In This Folder

`AccordionPatternExample.tsx` stores the currently open item ID and toggles each section.

## Common Interview Questions

What state does an accordion need?

Open item ID for single-open accordions, or a set of open IDs for multi-open accordions.

Why use a button for the header?

Because it is interactive and keyboard accessible by default.

What accessibility matters?

Use clear buttons, expanded state, panel relationships, and keyboard support.

## Common Mistakes

Using divs for clickable headers.

Hardcoding only one item.

Not supporting keyboard users.

## Best Practices

Use stable IDs.

Use buttons for toggles.

Choose single-open or multi-open behavior intentionally.

## Quick Revision Notes

Open state controls panels.

Buttons toggle sections.

ARIA improves production accessibility.
