import { useEffect, useState } from 'react'

export default function RealTimeUpdatesExample() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMessages((current) =>
        [`Live update ${current.length + 1}`, ...current].slice(0, 5),
      )
    }, 1200)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <ul className="demo-list">
      {messages.map((message) => (
        <li key={message}>
          <span>{message}</span>
          <strong>Socket</strong>
        </li>
      ))}
    </ul>
  )
}
