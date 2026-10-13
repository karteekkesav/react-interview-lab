const strategies = [
  { name: 'CSR', detail: 'Browser renders after JavaScript loads.' },
  { name: 'SSR', detail: 'Server renders HTML per request.' },
  { name: 'SSG', detail: 'HTML is generated at build time.' },
]

export default function RenderingStrategiesExample() {
  return (
    <div className="demo-stack">
      {strategies.map((strategy) => (
        <article className="demo-card" key={strategy.name}>
          <div>
            <h3>{strategy.name}</h3>
            <p>{strategy.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
