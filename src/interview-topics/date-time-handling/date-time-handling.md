# Date And Time Handling

## Interview Definition

Date and time handling means storing, transferring, formatting, and comparing time values correctly across time zones and locales.

## Deep Explanation

Production apps usually store timestamps in UTC or ISO format and format them for the user's locale at display time. Time zones, daylight saving time, and date-only values need special care.

## Example Used In This Folder

`DateTimeHandlingExample.tsx` formats the same UTC timestamp in local time and UTC.

## Common Interview Questions

How should servers store timestamps?

Usually in UTC.

How should dates be displayed?

Format for the user's locale and intended time zone.

What is a common time zone bug?

Treating date-only values like midnight UTC, which can shift the displayed date in some time zones.

## Common Mistakes

Hardcoding date formats.

Ignoring time zones.

Parsing ambiguous date strings.

## Best Practices

Store timestamps consistently.

Use `Intl` for formatting.

Be explicit about time zones.

## Quick Revision Notes

Store UTC.

Display locale-aware.

Date-only values are tricky.
