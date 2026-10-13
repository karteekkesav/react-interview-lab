# Toast Notifications

## Interview Definition

Toast notifications are temporary messages that give users feedback about actions such as saves, errors, uploads, or background events.

## Deep Explanation

Good toast systems handle message queues, auto-dismiss, manual dismiss, accessibility announcements, variants, and placement.

## Example Used In This Folder

`ToastNotificationsExample.tsx` adds success and error toasts, then automatically removes them after a delay.

## Common Interview Questions

Where should toast state live?

Usually in a top-level provider so any feature can trigger a toast.

What accessibility matters?

Use live regions carefully so screen readers announce important messages.

Should every error be a toast?

No. Field errors and persistent page errors often belong inline.

## Common Mistakes

Showing too many toasts.

Making important errors disappear too quickly.

Ignoring screen reader announcements.

## Best Practices

Use toasts for temporary feedback.

Provide inline errors for form validation.

Centralize toast creation in larger apps.

## Quick Revision Notes

Temporary feedback.

Auto-dismiss plus optional manual dismiss.

Use live regions responsibly.
