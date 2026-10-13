type User = {
  name: string
  role: string
}

function withCurrentUser<P extends { user: User }>(
  Component: React.ComponentType<P>,
) {
  return function ComponentWithCurrentUser(props: Omit<P, 'user'>) {
    const user = { name: 'Ananya', role: 'React Engineer' }
    return <Component {...(props as P)} user={user} />
  }
}

function ProfileBadge({ user }: { user: User }) {
  return (
    <article className="demo-card">
      <div>
        <h3>{user.name}</h3>
        <p>{user.role}</p>
      </div>
    </article>
  )
}

const ProfileBadgeWithUser = withCurrentUser(ProfileBadge)

export default function HigherOrderComponentsExample() {
  return <ProfileBadgeWithUser />
}
