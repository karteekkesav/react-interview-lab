# Real-Time Communication In React

## Interview Definition

Real-time communication means the UI can receive updated information without the user manually refreshing the page. React does not provide real-time communication by itself. React renders the UI, while browser APIs and backend protocols provide the communication layer.

## Why This Matters For Your Resume

Your Stablehouse FinTech onboarding project is the best project to explain this topic. You worked on POI, POA, Investor Type, Account Type, document upload, onboarding submission, dynamic screen rendering, GraphQL APIs, and Liveness Verification.

These flows often need status updates after the first submission:

- document uploaded
- verification started
- under review
- approved
- rejected
- retry required

In interviews, you can say:

In my Stablehouse onboarding work, request-response GraphQL APIs fit submit and fetch flows. For status-driven flows such as document verification or liveness verification, polling or SSE can keep the UI updated. If the product needs two-way real-time updates, such as live admin review dashboards or notifications, WebSockets are a better fit.

## Request-Response Cycle

Request-response is the normal REST or GraphQL pattern.

```text
React UI -> API request -> Server
React UI <- API response <- Server
```

Example:

```ts
async function submitOnboarding(payload: OnboardingPayload) {
  const response = await fetch("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return response.json()
}
```

Use it for:

- login
- form submit
- document upload
- fetch dashboard data
- GraphQL queries and mutations

Limitation:

The client only receives data when it asks. It is not ideal when server-side status changes after the original response.

## Short Polling

Short polling means the client repeatedly asks the server for updates at a fixed interval.

```text
React UI -> status request -> Server
React UI <- current status <- Server

wait 5 seconds

React UI -> status request -> Server
React UI <- current status <- Server
```

Example:

```tsx
useEffect(() => {
  const intervalId = window.setInterval(async () => {
    const status = await getVerificationStatus(userId)
    setStatus(status)
  }, 5000)

  return () => window.clearInterval(intervalId)
}, [userId])
```

Use it when:

- backend does not support push updates
- exact real-time updates are not required
- status changes are simple

Resume example:

After POI or POA document upload, the UI can poll the verification status every few seconds until it becomes `approved`, `rejected`, or `retry_required`.

## Long Polling

Long polling means the client sends a request, but the server keeps it open until it has new data or a timeout occurs.

```text
React UI -> status request -----------------> Server
React UI <- response when update exists ----- Server
React UI -> next status request ------------> Server
```

Example:

```tsx
useEffect(() => {
  let isActive = true

  async function listenForStatus() {
    while (isActive) {
      const update = await waitForVerificationUpdate(userId)
      if (isActive) {
        setStatus(update.status)
      }
    }
  }

  listenForStatus()

  return () => {
    isActive = false
  }
}, [userId])
```

Use it when:

- updates are not frequent
- backend can hold requests
- WebSocket infrastructure is not available

Interview summary:

Long polling is more efficient than short polling for less frequent updates because the server responds only when something changes.

## Server-Sent Events SSE

SSE lets the server push updates to the browser over a long-lived HTTP connection. It is one-way: server to client.

```text
React UI opens EventSource
          |
          v
Server keeps connection open
          |
          v
Server pushes status events to React UI
```

Example:

```tsx
useEffect(() => {
  const events = new EventSource(`/api/onboarding/${userId}/events`)

  events.onmessage = (event) => {
    const update = JSON.parse(event.data)
    setStatus(update.status)
  }

  events.onerror = () => {
    events.close()
  }

  return () => events.close()
}, [userId])
```

Use it for:

- onboarding status updates
- notification feed
- audit log stream
- dashboard metrics where client does not need to send messages back

Interview summary:

SSE is simpler than WebSocket when the app only needs server-to-client updates.

## WebSockets

WebSockets create a persistent two-way connection between client and server.

```text
React UI <==== persistent connection ====> Server

Client can send messages.
Server can send messages.
```

Example:

```tsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/onboarding")

  socket.onmessage = (event) => {
    const update = JSON.parse(event.data)
    setStatus(update.status)
  }

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "subscribe", userId }))
  }

  return () => socket.close()
}, [userId])
```

Use it for:

- chat
- live notifications
- trading prices
- live admin dashboards
- collaborative apps

Resume example:

For Stablehouse, WebSockets would fit an admin review dashboard where compliance agents and users need live two-way updates. For simple onboarding status updates, SSE or polling may be enough.

## Comparison Table

| Pattern | Direction | Connection | Best for |
| --- | --- | --- | --- |
| Request-response | Client asks, server replies | Short-lived | Submit forms, GraphQL queries, REST calls |
| Short polling | Client repeatedly asks | Repeated short requests | Simple status checks |
| Long polling | Client asks, server waits | Held HTTP request | Infrequent updates |
| SSE | Server pushes to client | Long-lived HTTP | Notifications, status streams |
| WebSocket | Two-way | Persistent socket | Live dashboards, chat, collaboration |

## Common Interview Questions

What is the limitation of request-response?

The client receives data only when it asks. If server state changes later, the UI will not know unless it asks again or the server pushes an update.

Short polling vs long polling?

Short polling calls the server at fixed intervals. Long polling keeps the request open until the server has an update.

SSE vs WebSocket?

SSE is one-way from server to client and uses HTTP. WebSocket is two-way and uses a persistent socket connection.

When would you use polling instead of WebSocket?

Use polling when updates are simple, not extremely frequent, and backend infrastructure does not support real-time push.

How do you avoid memory leaks?

Clean up timers, close `EventSource`, close WebSocket connections, and avoid setting state after unmount.

## Quick Revision Notes

Request-response is enough for normal API calls.

Polling is simple but can waste requests.

Long polling reduces unnecessary responses.

SSE is good for server-to-client updates.

WebSocket is best for two-way real-time communication.
