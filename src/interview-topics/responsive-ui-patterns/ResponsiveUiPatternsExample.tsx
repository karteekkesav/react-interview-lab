const cards = ['Profile', 'Interviews', 'Feedback', 'Offer']

export default function ResponsiveUiPatternsExample() {
  return (
    <div className="responsive-grid">
      {cards.map((card) => (
        <article className="demo-card" key={card}>
          <div>
            <h3>{card}</h3>
            <p>Grid adapts without changing the component code.</p>
          </div>
        </article>
      ))}
    </div>
  )
}
