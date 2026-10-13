# Dark Mode And Theming

## Interview Definition

Theming lets an app switch visual tokens such as colors, spacing, and typography. Dark mode is a common theme variant.

## Deep Explanation

Good theming uses design tokens or CSS variables instead of hardcoded colors. Apps may respect system preference, store user preference, and ensure accessible contrast.

## Example Used In This Folder

`DarkModeThemingExample.tsx` toggles between light and dark preview styles.

## Common Interview Questions

How do you implement dark mode?

Use CSS variables or theme classes, then toggle a class or data attribute.

How do you persist theme?

Store the user preference in localStorage or user profile settings.

What accessibility matters?

Color contrast, focus states, and not relying on color alone.

## Common Mistakes

Hardcoding colors throughout components.

Ignoring system preference.

Creating low-contrast dark themes.

## Best Practices

Use tokens or CSS variables.

Persist user preference.

Test contrast in both themes.

## Quick Revision Notes

Tokens power themes.

Dark mode needs contrast.

Preference can be persisted.
