import { useState } from 'react'

export default function FeatureFlagsExample() {
  const [flags, setFlags] = useState({
    newDashboard: true,
    betaSearch: false,
  })

  return (
    <div className="demo-stack">
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={flags.betaSearch}
          onChange={(event) =>
            setFlags((current) => ({
              ...current,
              betaSearch: event.target.checked,
            }))
          }
        />
        Enable beta search
      </label>
      <article className="demo-card">
        <div>
          <h3>{flags.newDashboard ? 'New Dashboard' : 'Classic Dashboard'}</h3>
          <p>{flags.betaSearch ? 'Beta search is visible.' : 'Stable search is visible.'}</p>
        </div>
      </article>
    </div>
  )
}
