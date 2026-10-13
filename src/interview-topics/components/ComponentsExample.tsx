type StatCardProps = {
  label: string
  value: string
  helper: string
}

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="demo-card">
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
        <p>{helper}</p>
      </div>
    </article>
  )
}

export default function ComponentsExample() {
  return (
    <div className="demo-stack">
      <StatCard
        label="Reusable component"
        value="StatCard"
        helper="Receives data through typed props."
      />
      <StatCard
        label="Composition"
        value="Dashboard"
        helper="The parent arranges smaller UI pieces."
      />
    </div>
  )
}
