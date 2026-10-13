import { useState } from 'react'

export default function EventsExample() {
  const [searchText, setSearchText] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('No search yet')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedSearch(searchText.trim() || 'Empty search ignored')
  }

  function handleClear() {
    setSearchText('')
    setSubmittedSearch('Search cleared')
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit}>
      <label>
        Movie search
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by title"
        />
      </label>
      <div className="button-row">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
      <p className="status-box">
        <strong>Last action:</strong> {submittedSearch}
      </p>
    </form>
  )
}
