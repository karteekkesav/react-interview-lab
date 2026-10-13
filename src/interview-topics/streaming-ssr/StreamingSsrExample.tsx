const streamSteps = [
  'Server starts rendering shell',
  'HTML is sent before all data is ready',
  'Suspense boundaries reveal content progressively',
  'Client hydrates interactive sections',
]

export default function StreamingSsrExample() {
  return (
    <ol className="demo-list">
      {streamSteps.map((step, index) => (
        <li key={step}>
          <span>{step}</span>
          <strong>{index + 1}</strong>
        </li>
      ))}
    </ol>
  )
}
