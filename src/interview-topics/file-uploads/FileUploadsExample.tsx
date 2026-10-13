import { useState } from 'react'

type SelectedFile = {
  name: string
  sizeInKb: number
  type: string
}

export default function FileUploadsExample() {
  const [file, setFile] = useState<SelectedFile | null>(null)
  const [error, setError] = useState('')

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    setError('')

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.size > 1024 * 1024) {
      setFile(null)
      setError('Please choose a file smaller than 1 MB.')
      return
    }

    setFile({
      name: selectedFile.name,
      sizeInKb: Math.round(selectedFile.size / 1024),
      type: selectedFile.type || 'unknown',
    })
  }

  return (
    <div className="demo-stack">
      <label className="field-row">
        Upload resume
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      </label>
      {error && <p className="status-box">{error}</p>}
      {file && (
        <article className="demo-card">
          <div>
            <h3>{file.name}</h3>
            <p>
              {file.sizeInKb} KB - {file.type}
            </p>
          </div>
        </article>
      )}
    </div>
  )
}
