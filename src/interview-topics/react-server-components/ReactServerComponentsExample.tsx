const serverComponentTraits = [
  'Can read server-only data sources',
  'Do not include client-side event handlers',
  'Can reduce shipped JavaScript',
]

export default function ReactServerComponentsExample() {
  return (
    <ul className="demo-list">
      {serverComponentTraits.map((trait) => (
        <li key={trait}>
          <span>{trait}</span>
          <strong>RSC</strong>
        </li>
      ))}
    </ul>
  )
}
