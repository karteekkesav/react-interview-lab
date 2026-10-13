import { useState } from 'react'

export default function DarkModeThemingExample() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className={`theme-preview ${theme}`}>
      <div>
        <h3>{theme === 'dark' ? 'Dark theme' : 'Light theme'}</h3>
        <p>Theme tokens should control colors consistently.</p>
      </div>
      <button
        type="button"
        onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      >
        Toggle theme
      </button>
    </div>
  )
}
