const candidate = {
  name: 'Priya Sharma',
  role: 'React Developer',
  skills: ['JSX', 'Props', 'Hooks'],
  available: true,
}

export default function JsxExample() {
  const profileLabel = `${candidate.name} - ${candidate.role}`

  return (
    <article className="demo-card">
      <div>
        <h3>{profileLabel}</h3>
        <p>
          {candidate.available
            ? 'Available for interviews'
            : 'Not available right now'}
        </p>
        <p>Skills: {candidate.skills.join(', ')}</p>
      </div>
      <button type="button" aria-label={`View ${candidate.name}`}>
        View profile
      </button>
    </article>
  )
}
