# WebSockets And Real-Time Updates

## Interview Definition

Real-time updates push data from server to client without waiting for manual refresh or polling.

## Deep Explanation

WebSockets create a persistent two-way connection. Server-Sent Events provide one-way server-to-client streams. They are useful for chat, dashboards, collaboration, notifications, and live status.

## Example Used In This Folder

`RealTimeUpdatesExample.tsx` simulates incoming real-time messages with an interval.

## Common Interview Questions

When use WebSockets?

When the client and server need low-latency two-way communication.

What should you handle?

Connection state, reconnects, cleanup, duplicate events, and ordering.

How are WebSockets different from polling?

Polling repeatedly asks. WebSockets push updates over an open connection.

## Common Mistakes

Not cleaning up connections.

Ignoring reconnect behavior.

Assuming messages always arrive in perfect order.

## Best Practices

Close connections on cleanup.

Show connection state.

Handle reconnects and duplicate events.

## Quick Revision Notes

WebSockets are persistent.

Good for low-latency updates.

Cleanup and reconnects matter.
