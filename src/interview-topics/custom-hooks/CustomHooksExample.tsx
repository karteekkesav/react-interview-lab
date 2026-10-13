import { useEffect, useState } from 'react'

function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? (JSON.parse(storedValue) as T) : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

export default function CustomHooksExample() {
  const [notes, setNotes] = useLocalStorageState(
    'react-interview-lab-notes',
    'Props are read-only inputs.',
  )

  return (
    <label className="demo-form single-field">
      Revision note
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={5}
      />
      <span>Your note persists in localStorage through a custom hook.</span>
    </label>
  )
}
