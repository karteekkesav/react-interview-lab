const protections = [
  'SameSite cookies',
  'CSRF tokens',
  'Origin and Referer checks',
  'Avoid unsafe GET mutations',
]

export default function CsrfConceptsExample() {
  return (
    <ul className="demo-list">
      {protections.map((protection) => (
        <li key={protection}>
          <span>{protection}</span>
          <strong>CSRF</strong>
        </li>
      ))}
    </ul>
  )
}
