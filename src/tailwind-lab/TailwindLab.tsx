import { useMemo, useState } from 'react'

type Topic = {
  id: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  summary: string
  code: string
  explanation: string[]
  interviewAnswer: string
}

const topics: Topic[] = [
  {
    id: 'utility-first',
    title: 'Utility First Styling',
    level: 'Beginner',
    summary:
      'Tailwind builds UI by composing small utility classes directly in JSX.',
    code: `<button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
  Save Changes
</button>`,
    explanation: [
      'Each class applies one small CSS rule, such as padding, color, border radius, or hover state.',
      'In interviews, explain that this keeps styling close to the component and avoids naming many custom CSS classes.',
      'For teams, repeated patterns should become reusable React components, not copied everywhere.',
    ],
    interviewAnswer:
      'Tailwind is a utility-first CSS framework. Instead of writing custom CSS class names for every component, we compose existing utility classes in JSX and extract repeated UI into reusable components.',
  },
  {
    id: 'spacing-layout',
    title: 'Spacing and Layout',
    level: 'Beginner',
    summary:
      'Spacing utilities like p, m, gap, flex, and grid make layout predictable.',
    code: `<section className="grid gap-4 md:grid-cols-3">
  <article className="rounded-lg border p-4">Revenue</article>
  <article className="rounded-lg border p-4">Users</article>
  <article className="rounded-lg border p-4">Conversion</article>
</section>`,
    explanation: [
      '`p-4` means padding, `gap-4` means space between grid items, and `md:grid-cols-3` applies three columns from the medium breakpoint.',
      'This is useful in dashboards because the same markup can be one column on mobile and multiple columns on desktop.',
      'Interview tip: mention mobile-first responsive design. Base classes apply first, breakpoint classes override on larger screens.',
    ],
    interviewAnswer:
      'I use Tailwind spacing and layout utilities to build mobile-first layouts. For example, a card grid can be one column by default and become three columns at the md breakpoint using md:grid-cols-3.',
  },
  {
    id: 'responsive',
    title: 'Responsive Design',
    level: 'Beginner',
    summary:
      'Tailwind uses breakpoint prefixes like sm, md, lg, and xl for responsive UI.',
    code: `<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  {stats.map((stat) => (
    <StatCard key={stat.label} stat={stat} />
  ))}
</div>`,
    explanation: [
      'Tailwind is mobile-first. `grid-cols-1` applies to all screens, then `md:grid-cols-2` and `xl:grid-cols-4` apply as the viewport grows.',
      'This approach is interview-friendly because it is simple to explain and easy to inspect in JSX.',
      'For enterprise apps, responsive utilities help build dashboards, admin panels, and onboarding screens without separate CSS files for each breakpoint.',
    ],
    interviewAnswer:
      'Tailwind responsive classes are mobile-first. I start with the mobile layout and add breakpoint prefixes such as md: and xl: only where the design needs to change.',
  },
  {
    id: 'states',
    title: 'States and Accessibility',
    level: 'Intermediate',
    summary:
      'Use hover, focus, disabled, aria, group, and peer utilities for interactive states.',
    code: `<button
  disabled={isSaving}
  className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isSaving ? 'Saving...' : 'Save'}
</button>`,
    explanation: [
      '`hover:` handles pointer state, `focus:` handles keyboard focus, and `disabled:` handles unavailable actions.',
      'Good interview answer: styling is not only visual. Focus rings, disabled states, and readable contrast improve accessibility.',
      'Use semantic HTML first, then Tailwind classes for visual behavior.',
    ],
    interviewAnswer:
      'For interactive UI, I style hover, focus, loading, disabled, and error states. I also keep semantic elements like button and label so the component remains accessible.',
  },
  {
    id: 'forms',
    title: 'Forms',
    level: 'Intermediate',
    summary:
      'Tailwind is useful for consistent labels, inputs, validation messages, and form actions.',
    code: `<label className="grid gap-2 text-sm font-medium text-slate-700">
  Email
  <input
    className="rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    placeholder="you@example.com"
  />
</label>
<p className="text-sm font-medium text-red-600">Email is required.</p>`,
    explanation: [
      'Forms need clear spacing, readable labels, focus styles, disabled states, and error messages.',
      'Tailwind keeps those states visible in the component, which is helpful during code review.',
      'For real projects, combine Tailwind with React Hook Form, Formik, or custom validation depending on form complexity.',
    ],
    interviewAnswer:
      'I style forms with clear label-input structure, focus rings, validation messages, and disabled/loading states. Tailwind handles the UI while form libraries handle validation and submission logic.',
  },
  {
    id: 'components',
    title: 'Reusable Components',
    level: 'Intermediate',
    summary:
      'When utility classes repeat, extract them into reusable React components.',
    code: `function Button({ variant = 'primary', children }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  }

  return (
    <button className={\`rounded-md px-4 py-2 font-semibold \${styles[variant]}\`}>
      {children}
    </button>
  )
}`,
    explanation: [
      'Tailwind does not mean every class list should be copied forever.',
      'Create components for buttons, cards, inputs, badges, modals, and repeated dashboard widgets.',
      'In larger apps, you can use libraries like clsx, cva, or tailwind-merge for cleaner variant handling.',
    ],
    interviewAnswer:
      'For repeated UI, I create reusable components with variant props. This keeps Tailwind productive while avoiding duplicated class strings across the application.',
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    level: 'Intermediate',
    summary:
      'Dark mode is commonly handled with dark: utilities and a class or media strategy.',
    code: `<div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
  <h2 className="text-lg font-bold">Account Summary</h2>
  <p className="text-slate-600 dark:text-slate-300">Theme-aware content</p>
</div>`,
    explanation: [
      '`dark:` classes apply when the app is in dark mode, depending on the configured strategy.',
      'In enterprise apps, theme state usually comes from user settings or system preference.',
      'Keep color choices token-like and consistent so the app does not become hard to maintain.',
    ],
    interviewAnswer:
      'I use dark mode utilities for theme-specific colors and keep theme state centralized, usually from user preferences or app settings.',
  },
  {
    id: 'tables-dashboard',
    title: 'Tables and Dashboards',
    level: 'Intermediate',
    summary:
      'Dashboards need dense, scannable UI with cards, tables, badges, filters, and actions.',
    code: `<div className="overflow-hidden rounded-lg border border-slate-200">
  <table className="w-full text-left text-sm">
    <thead className="bg-slate-50 text-slate-700">
      <tr>
        <th className="px-4 py-3">Customer</th>
        <th className="px-4 py-3">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200">
      <tr className="hover:bg-slate-50">
        <td className="px-4 py-3">Karteek Kesav</td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
            Verified
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
    explanation: [
      'Dashboards should focus on scanability: consistent row height, clear status badges, and readable spacing.',
      'Use `overflow-x-auto` or responsive layouts for tables on smaller screens.',
      'For very large tables, combine Tailwind styling with AG Grid or virtualization.',
    ],
    interviewAnswer:
      'For dashboards, I use Tailwind for layout and visual states, but I rely on table/grid libraries when the data needs sorting, filtering, virtualization, or export.',
  },
  {
    id: 'animation',
    title: 'Transitions and Animation',
    level: 'Intermediate',
    summary:
      'Use transition utilities for small state changes like hover, focus, menus, and panels.',
    code: `<button className="rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700">
  View Report
</button>`,
    explanation: [
      '`transition`, `duration-200`, and transform utilities create simple micro-interactions.',
      'Use motion carefully in business apps. It should confirm actions or guide attention, not distract.',
      'For complex animation, use a dedicated animation library instead of forcing everything into utility classes.',
    ],
    interviewAnswer:
      'I use Tailwind transitions for small UI feedback like hover, focus, dropdowns, and panels. For complex flows, I use a motion library.',
  },
  {
    id: 'theme-customization',
    title: 'Theme Customization',
    level: 'Advanced',
    summary:
      'Real projects customize tokens such as colors, spacing, typography, and breakpoints.',
    code: `/* Tailwind v4 CSS-first theme example */
@theme {
  --color-brand: #2563eb;
  --radius-card: 0.5rem;
}`,
    explanation: [
      'Tailwind v4 supports CSS-first configuration for design tokens.',
      'A project can define brand colors and spacing tokens, then use them consistently in components.',
      'Interview tip: connect this to design systems. Tailwind is strongest when teams standardize tokens and reusable components.',
    ],
    interviewAnswer:
      'For enterprise apps, I would customize Tailwind around design tokens so colors, spacing, typography, and radius are consistent across the product.',
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    level: 'Advanced',
    summary:
      'Tailwind scales well when paired with component boundaries and clear class organization.',
    code: `// Good interview-friendly approach
<StatusBadge status="completed" />
<PrimaryButton isLoading={isSaving}>Save</PrimaryButton>

// Avoid repeating the same long class list in many screens.`,
    explanation: [
      'Extract repeated UI into components.',
      'Keep conditionals readable. If class logic grows, use helper libraries or local variables.',
      'Do not use Tailwind to hide weak semantics. Accessible HTML still matters.',
      'For performance, Tailwind generates only the classes used in your source files.',
    ],
    interviewAnswer:
      'My Tailwind best practice is to use utilities for speed, components for reuse, and design tokens for consistency. I avoid repeating long class lists across screens.',
  },
]

const stats = [
  { label: 'Verified users', value: '8,240', change: '+12%' },
  { label: 'Pending reviews', value: '316', change: '-8%' },
  { label: 'Success rate', value: '97.4%', change: '+3%' },
]

const transactions = [
  { id: 'POI-1001', customer: 'Karteek Kesav', status: 'Verified' },
  { id: 'POA-1002', customer: 'Asha Rao', status: 'Pending' },
  { id: 'KYC-1003', customer: 'Rahul Mehta', status: 'Failed' },
]

const statusStyles = {
  Verified: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Failed: 'bg-rose-100 text-rose-700',
}

function VisualModel() {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
        Visual mental model
      </p>
      <div className="grid gap-3 md:grid-cols-4">
        {['JSX', 'Tailwind classes', 'Generated CSS', 'Rendered UI'].map(
          (step, index) => (
            <div
              key={step}
              className="relative rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-xs font-bold text-slate-500">
                Step {index + 1}
              </span>
              <strong className="mt-1 block text-sm text-slate-950">
                {step}
              </strong>
              {index < 3 ? (
                <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-blue-300 bg-slate-50 md:block" />
              ) : null}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function PatternGallery() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Resume style pattern
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              POI and POA Review Dashboard
            </h2>
          </div>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Export
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ['POI verified', '1,284', 'bg-emerald-50 text-emerald-700'],
            ['POA pending', '248', 'bg-amber-50 text-amber-700'],
            ['Failed checks', '37', 'bg-rose-50 text-rose-700'],
          ].map(([label, value, classes]) => (
            <article
              key={label}
              className={`rounded-lg border border-slate-200 p-4 ${classes}`}
            >
              <p className="text-sm font-semibold">{label}</p>
              <strong className="mt-2 block text-2xl">{value}</strong>
            </article>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {item.customer}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        statusStyles[item.status as keyof typeof statusStyles]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Class anatomy
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">
          How to read a Tailwind class
        </h2>
        <div className="mt-5 grid gap-3">
          {[
            ['md:', 'Apply from medium screens and above'],
            ['hover:', 'Apply only during hover state'],
            ['bg-blue-600', 'Set background color'],
            ['px-4 py-2', 'Set horizontal and vertical padding'],
            ['rounded-md', 'Set border radius'],
          ].map(([token, meaning]) => (
            <div
              key={token}
              className="grid grid-cols-[110px_1fr] gap-3 rounded-md bg-slate-50 p-3"
            >
              <code className="rounded bg-slate-900 px-2 py-1 text-sm font-bold text-white">
                {token}
              </code>
              <span className="text-sm text-slate-600">{meaning}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function LivePreview({ topicId }: { topicId: string }) {
  if (topicId === 'forms') {
    return (
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Document type
          <select className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>Proof of Identity</option>
            <option>Proof of Address</option>
          </select>
        </label>
        <p className="text-sm font-semibold text-rose-600">
          Upload a valid document before submitting.
        </p>
      </form>
    )
  }

  if (topicId === 'tables-dashboard') {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {item.id}
                </td>
                <td className="px-4 py-3 text-slate-700">{item.customer}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      statusStyles[item.status as keyof typeof statusStyles]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (topicId === 'dark-mode') {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-900">
          <h3 className="font-bold">Light card</h3>
          <p className="mt-1 text-sm text-slate-600">Default theme colors.</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-100">
          <h3 className="font-bold text-white">Dark card</h3>
          <p className="mt-1 text-sm text-slate-300">Dark mode equivalent.</p>
        </div>
      </div>
    )
  }

  if (topicId === 'states') {
    return (
      <div className="flex flex-wrap gap-3">
        <button className="rounded-md bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Active button
        </button>
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-slate-400 px-4 py-2 font-semibold text-white opacity-60"
        >
          Disabled
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <strong className="mt-2 block text-2xl text-slate-950">
            {stat.value}
          </strong>
          <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
            {stat.change}
          </span>
        </article>
      ))}
    </div>
  )
}

function TailwindLab() {
  const [selectedId, setSelectedId] = useState(topics[0].id)
  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedId) ?? topics[0],
    [selectedId],
  )

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-700 md:p-8">
      <section className="mx-auto grid max-w-7xl gap-6">
        <div className="rounded-lg bg-slate-950 px-5 py-6 text-white shadow-lg md:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
            Tailwind CSS Interview Lab
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold text-white md:text-5xl">
            Learn Tailwind through interview-ready React UI examples
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300">
            This separate lab covers beginner to advanced Tailwind concepts with
            live previews, JavaScript-friendly snippets, diagrams, and short
            answers you can use during interviews.
          </p>
        </div>

        <VisualModel />

        <PatternGallery />

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Concepts
            </p>
            <div className="grid gap-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedId(topic.id)}
                  className={`grid min-h-0 rounded-md border px-3 py-3 text-left transition ${
                    selectedTopic.id === topic.id
                      ? 'border-blue-200 bg-blue-50 text-blue-900'
                      : 'border-transparent bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">{topic.title}</span>
                  <small className="mt-1 text-slate-500">{topic.level}</small>
                </button>
              ))}
            </div>
          </aside>

          <section className="grid gap-5">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {selectedTopic.level}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">
                    {selectedTopic.title}
                  </h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  React + Tailwind
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-slate-600">
                {selectedTopic.summary}
              </p>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">Live Preview</h3>
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <LivePreview topicId={selectedTopic.id} />
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">
                Executable Example
              </h3>
              <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                <code>{selectedTopic.code}</code>
              </pre>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">
                Explanation
              </h3>
              <ul className="mt-4 grid gap-3">
                {selectedTopic.explanation.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h3 className="text-lg font-bold text-blue-950">
                Interview Answer
              </h3>
              <p className="mt-3 max-w-4xl text-blue-900">
                {selectedTopic.interviewAnswer}
              </p>
            </article>
          </section>
        </div>
      </section>
    </main>
  )
}

export default TailwindLab
