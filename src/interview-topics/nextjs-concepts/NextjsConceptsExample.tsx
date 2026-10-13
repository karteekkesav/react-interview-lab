const concepts = [
  { name: 'Routing', detail: 'File-system routes and layouts' },
  { name: 'Rendering', detail: 'Static, server, and client rendering choices' },
  { name: 'Data', detail: 'Server fetching, caching, and revalidation' },
]

export default function NextjsConceptsExample() {
  return (
    <div className="demo-stack">
      {concepts.map((concept) => (
        <article className="demo-card" key={concept.name}>
          <div>
            <h3>{concept.name}</h3>
            <p>{concept.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
