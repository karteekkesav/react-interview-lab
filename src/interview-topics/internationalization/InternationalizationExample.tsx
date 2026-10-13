import { useState } from 'react'

const messages = {
  en: 'You have 3 interviews today.',
  hi: 'आज आपके 3 इंटरव्यू हैं।',
}

export default function InternationalizationExample() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en')
  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date())

  return (
    <div className="demo-stack">
      <div className="segmented-control">
        <button
          type="button"
          className={locale === 'en' ? 'selected' : ''}
          onClick={() => setLocale('en')}
        >
          English
        </button>
        <button
          type="button"
          className={locale === 'hi' ? 'selected' : ''}
          onClick={() => setLocale('hi')}
        >
          Hindi
        </button>
      </div>
      <p className="status-box">
        {messages[locale]}
        <br />
        {formattedDate}
      </p>
    </div>
  )
}
