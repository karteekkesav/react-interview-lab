# Internationalization i18n

## Interview Definition

Internationalization prepares an app to support multiple languages, locales, formats, and cultural expectations.

## Deep Explanation

i18n is more than translating strings. It includes dates, numbers, currency, pluralization, text direction, sorting, and locale-specific content.

## Example Used In This Folder

`InternationalizationExample.tsx` switches messages and formats the date using `Intl.DateTimeFormat`.

## Common Interview Questions

What does i18n include?

Translation, formatting, plural rules, text direction, and locale-specific behavior.

Why avoid hardcoded strings?

They make translation difficult and inconsistent.

What browser API helps formatting?

The `Intl` APIs handle dates, numbers, currency, and plural rules.

## Common Mistakes

Concatenating translated strings.

Ignoring pluralization.

Hardcoding date and currency formats.

## Best Practices

Use message keys and translation files.

Use `Intl` or i18n libraries for formatting.

Plan for text length changes.

## Quick Revision Notes

i18n is more than text.

Use locale-aware formatting.

Avoid string concatenation.
