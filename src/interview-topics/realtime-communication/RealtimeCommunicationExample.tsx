import { useEffect, useMemo, useState } from 'react'

type CommunicationMode =
  | 'request-response'
  | 'short-polling'
  | 'long-polling'
  | 'sse'
  | 'websocket'

type Activity = {
  id: number
  label: string
  source: string
}

const modeDetails: Record<
  CommunicationMode,
  {
    title: string
    source: string
    description: string
  }
> = {
  'request-response': {
    title: 'Request-response',
    source: 'GraphQL/REST',
    description:
      'Client asks once and receives one response. Good for submit, save, and fetch flows.',
  },
  'short-polling': {
    title: 'Short polling',
    source: 'Interval API',
    description:
      'Client checks status repeatedly at a fixed interval. Simple, but can create extra traffic.',
  },
  'long-polling': {
    title: 'Long polling',
    source: 'Held HTTP request',
    description:
      'Client sends a request and the server waits until it has an update before responding.',
  },
  sse: {
    title: 'Server-Sent Events',
    source: 'EventSource',
    description:
      'Server pushes one-way updates over a long-lived HTTP connection.',
  },
  websocket: {
    title: 'WebSocket',
    source: 'Socket connection',
    description:
      'Client and server keep a persistent two-way connection for real-time messages.',
  },
}

const initialActivity: Activity[] = [
  {
    id: 1,
    label: 'POI document uploaded',
    source: 'GraphQL mutation',
  },
]

function getNextActivity(mode: CommunicationMode, count: number): Activity {
  const details = modeDetails[mode]

  return {
    id: Date.now(),
    label: `${details.title} update ${count}`,
    source: details.source,
  }
}

export default function RealtimeCommunicationExample() {
  const [mode, setMode] = useState<CommunicationMode>('request-response')
  const [activity, setActivity] = useState<Activity[]>(initialActivity)
  const [isRunning, setIsRunning] = useState(false)

  const selectedMode = modeDetails[mode]

  const connectionLabel = useMemo(() => {
    if (mode === 'request-response') return 'One request, one response'
    if (mode === 'websocket') return 'Persistent two-way connection'
    if (mode === 'sse') return 'Persistent server-to-client stream'
    if (mode === 'long-polling') return 'Request waits for server update'
    return 'Repeated client requests'
  }, [mode])

  useEffect(() => {
    if (!isRunning) return

    if (mode === 'request-response') {
      const timeoutId = window.setTimeout(() => {
        setActivity((current) => [
          getNextActivity(mode, current.length + 1),
          ...current,
        ])
        setIsRunning(false)
      }, 700)

      return () => window.clearTimeout(timeoutId)
    }

    const delay = mode === 'long-polling' ? 2200 : mode === 'short-polling' ? 1400 : 1000

    const intervalId = window.setInterval(() => {
      setActivity((current) =>
        [getNextActivity(mode, current.length + 1), ...current].slice(0, 6),
      )
    }, delay)

    return () => window.clearInterval(intervalId)
  }, [isRunning, mode])

  return (
    <div className="demo-stack">
      <div className="segmented-control" aria-label="Communication modes">
        {(Object.keys(modeDetails) as CommunicationMode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? 'selected' : undefined}
            onClick={() => {
              setMode(item)
              setIsRunning(false)
            }}
          >
            {modeDetails[item].title}
          </button>
        ))}
      </div>

      <div className="demo-card">
        <div>
          <h3>{selectedMode.title}</h3>
          <p>{selectedMode.description}</p>
        </div>
        <strong>{connectionLabel}</strong>
      </div>

      <div className="button-row">
        <button type="button" onClick={() => setIsRunning((value) => !value)}>
          {isRunning ? 'Pause demo' : 'Start demo'}
        </button>
        <button
          type="button"
          onClick={() => {
            setActivity(initialActivity)
            setIsRunning(false)
          }}
        >
          Reset
        </button>
      </div>

      <ul className="demo-list" aria-label="Onboarding status updates">
        {activity.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
            <strong>{item.source}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
