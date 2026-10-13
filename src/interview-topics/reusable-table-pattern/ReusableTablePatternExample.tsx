type Column<T> = {
  header: string
  render: (row: T) => React.ReactNode
}

type Candidate = {
  id: number
  name: string
  score: number
}

const columns: Column<Candidate>[] = [
  { header: 'Name', render: (row) => row.name },
  { header: 'Score', render: (row) => row.score },
]

const rows = [
  { id: 1, name: 'Asha', score: 91 },
  { id: 2, name: 'Rohan', score: 86 },
]

export default function ReusableTablePatternExample() {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.header}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
