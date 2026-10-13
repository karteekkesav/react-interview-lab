const stories = [
  'Default button',
  'Loading button',
  'Disabled button',
  'Error form state',
]

export default function StorybookConceptsExample() {
  return (
    <ul className="demo-list">
      {stories.map((story) => (
        <li key={story}>
          <span>{story}</span>
          <strong>Story</strong>
        </li>
      ))}
    </ul>
  )
}
