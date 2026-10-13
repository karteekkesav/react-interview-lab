import { useState } from 'react'

const tabs = [
  { id: 'overview', label: 'Overview', content: 'Summary of the candidate.' },
  { id: 'notes', label: 'Notes', content: 'Interview notes and feedback.' },
  { id: 'history', label: 'History', content: 'Past interview rounds.' },
]

export default function TabsPatternExample() {
  const [activeTab, setActiveTab] = useState('overview')
  const currentTab = tabs.find((tab) => tab.id === activeTab)

  return (
    <div className="demo-stack">
      <div className="segmented-control" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'selected' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="status-box" role="tabpanel">
        {currentTab?.content}
      </p>
    </div>
  )
}
