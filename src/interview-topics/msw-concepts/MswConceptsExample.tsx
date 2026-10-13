const handlers = [
  'GET /api/movies -> movie list',
  'POST /api/login -> test user session',
  'GET /api/profile -> profile fixture',
]

export default function MswConceptsExample() {
  return (
    <ul className="demo-list">
      {handlers.map((handler) => (
        <li key={handler}>
          <span>{handler}</span>
          <strong>Mock</strong>
        </li>
      ))}
    </ul>
  )
}
