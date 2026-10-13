# Responsive UI Patterns

## Interview Definition

Responsive UI adapts layout and interactions to different viewport sizes, input types, and content constraints.

## Deep Explanation

Responsive design is not only media queries. It includes flexible grids, intrinsic sizing, readable content, touch targets, navigation changes, and avoiding overflow.

## Example Used In This Folder

`ResponsiveUiPatternsExample.tsx` uses a responsive grid where cards wrap based on available width.

## Common Interview Questions

How do you build responsive layouts?

Use flexible CSS like grid, flexbox, minmax, clamp where appropriate, and targeted media queries.

What should you test?

Small screens, long text, keyboard focus, touch targets, and orientation changes.

Should desktop and mobile be separate components?

Usually not unless interaction patterns differ significantly.

## Common Mistakes

Hardcoding fixed widths.

Only testing one screen size.

Letting text overflow controls.

## Best Practices

Use fluid layouts.

Test real content lengths.

Keep touch targets usable.

## Quick Revision Notes

Flexible first.

Media queries when needed.

Content should not overflow.
