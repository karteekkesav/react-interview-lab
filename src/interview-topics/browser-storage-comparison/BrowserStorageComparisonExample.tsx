const storageOptions = [
  { name: 'localStorage', use: 'Persistent simple preferences' },
  { name: 'sessionStorage', use: 'Tab-scoped temporary data' },
  { name: 'Cookies', use: 'Server-readable small values' },
  { name: 'IndexedDB', use: 'Large structured offline data' },
]

export default function BrowserStorageComparisonExample() {
  return (
    <ul className="demo-list">
      {storageOptions.map((option) => (
        <li key={option.name}>
          <span>{option.name}</span>
          <strong>{option.use}</strong>
        </li>
      ))}
    </ul>
  )
}
