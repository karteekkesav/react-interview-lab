const e2eFlow = [
  'Visit login page',
  'Enter credentials',
  'Submit form',
  'Expect dashboard',
]

export default function EndToEndTestingExample() {
  return (
    <ol className="demo-list">
      {e2eFlow.map((step, index) => (
        <li key={step}>
          <span>{step}</span>
          <strong>{index + 1}</strong>
        </li>
      ))}
    </ol>
  )
}
