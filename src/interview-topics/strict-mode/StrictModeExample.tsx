import { useEffect, useState } from 'react'

export default function StrictModeExample() {
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setSubscribed(true)
    return () => setSubscribed(false)
  }, [])

  return (
    <p className="status-box">
      <strong>Subscription cleanup exists:</strong> {subscribed ? 'yes' : 'checking'}
    </p>
  )
}
