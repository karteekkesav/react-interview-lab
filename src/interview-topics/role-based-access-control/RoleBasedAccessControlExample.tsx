import { useState } from 'react'

type Role = 'viewer' | 'editor' | 'admin'

const permissions: Record<Role, string[]> = {
  viewer: ['read'],
  editor: ['read', 'write'],
  admin: ['read', 'write', 'delete'],
}

export default function RoleBasedAccessControlExample() {
  const [role, setRole] = useState<Role>('viewer')
  const canDelete = permissions[role].includes('delete')

  return (
    <div className="demo-stack">
      <div className="segmented-control">
        {(['viewer', 'editor', 'admin'] as Role[]).map((item) => (
          <button
            key={item}
            type="button"
            className={role === item ? 'selected' : ''}
            onClick={() => setRole(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <article className="demo-card">
        <div>
          <h3>Current role: {role}</h3>
          <p>Delete button is {canDelete ? 'available' : 'hidden'}.</p>
        </div>
        {canDelete && <button type="button">Delete record</button>}
      </article>
    </div>
  )
}
