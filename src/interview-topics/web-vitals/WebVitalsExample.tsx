const vitals = [
  { name: 'LCP', meaning: 'Loading performance' },
  { name: 'INP', meaning: 'Interaction responsiveness' },
  { name: 'CLS', meaning: 'Visual stability' },
]

export default function WebVitalsExample() {
  return (
    <div className="demo-stack">
      {vitals.map((vital) => (
        <article className="demo-card" key={vital.name}>
          <div>
            <h3>{vital.name}</h3>
            <p>{vital.meaning}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
