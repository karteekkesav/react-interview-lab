# Polling

## Interview Definition

Polling repeatedly fetches or refreshes data on a fixed interval.

## Deep Explanation

Polling is useful for dashboards, job status, notifications, or systems where real-time connections are unnecessary. It requires cleanup, pause/resume behavior, and careful interval choice.

## Example Used In This Folder

`PollingExample.tsx` updates a timestamp every 1.5 seconds and cleans up the interval.

## Common Interview Questions

When use polling?

When data needs periodic refresh but real-time streaming is not required.

Why clean up intervals?

To avoid memory leaks and duplicate polling after unmount or dependency changes.

What are alternatives?

WebSockets, Server-Sent Events, push notifications, or manual refresh.

## Common Mistakes

Creating intervals without cleanup.

Polling too frequently.

Continuing polling when the tab or feature is inactive.

## Best Practices

Clean up intervals.

Pause when not needed.

Use data libraries for production polling when available.

## Quick Revision Notes

Repeated refresh.

Cleanup matters.

Not always real-time.
