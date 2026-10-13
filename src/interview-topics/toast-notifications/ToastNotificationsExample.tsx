import { useState } from 'react'

type Toast = {
  id: number
  message: string
  tone: 'success' | 'error'
}

export default function ToastNotificationsExample() {
  const [toasts, setToasts] = useState<Toast[]>([])

  function addToast(tone: Toast['tone']) {
    const toast: Toast = {
      id: Date.now(),
      message: tone === 'success' ? 'Saved successfully.' : 'Save failed.',
      tone,
    }

    setToasts((current) => [toast, ...current])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, 2500)
  }

  return (
    <div className="demo-stack">
      <div className="button-row">
        <button type="button" onClick={() => addToast('success')}>
          Success toast
        </button>
        <button type="button" onClick={() => addToast('error')}>
          Error toast
        </button>
      </div>
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast ${toast.tone}`} key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
