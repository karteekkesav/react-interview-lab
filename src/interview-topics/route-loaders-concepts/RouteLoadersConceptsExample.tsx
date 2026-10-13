const loaderSteps = [
  'Match the route',
  'Load required data',
  'Render the screen with data',
  'Handle loading, errors, and redirects',
]

export default function RouteLoadersConceptsExample() {
  return (
    <ol className="demo-list">
      {loaderSteps.map((step, index) => (
        <li key={step}>
          <span>{step}</span>
          <strong>{index + 1}</strong>
        </li>
      ))}
    </ol>
  )
}
