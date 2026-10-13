const bundleChecks = [
  'Large dependencies',
  'Duplicate packages',
  'Missed code splitting',
  'Unused exports',
]

export default function BundleAnalysisExample() {
  return (
    <ul className="demo-list">
      {bundleChecks.map((check) => (
        <li key={check}>
          <span>{check}</span>
          <strong>Check</strong>
        </li>
      ))}
    </ul>
  )
}
