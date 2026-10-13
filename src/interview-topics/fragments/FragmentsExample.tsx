function DefinitionRow({ term, meaning }: { term: string; meaning: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{meaning}</dd>
    </>
  )
}

export default function FragmentsExample() {
  return (
    <dl className="definition-list">
      <DefinitionRow term="Fragment" meaning="Groups JSX without adding a DOM node." />
      <DefinitionRow term="Keyed Fragment" meaning="Useful when mapping multiple siblings." />
    </dl>
  )
}
