const deploymentSteps = [
  'Install dependencies',
  'Run tests and lint',
  'Build static assets',
  'Upload dist folder',
  'Serve with CDN or static host',
]

export default function BuildDeploymentExample() {
  return (
    <ol className="demo-list">
      {deploymentSteps.map((step, index) => (
        <li key={step}>
          <span>{step}</span>
          <strong>{index + 1}</strong>
        </li>
      ))}
    </ol>
  )
}
