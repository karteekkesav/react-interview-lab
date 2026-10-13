import { createContext, useContext, useState, type ReactNode } from 'react'

type TabsContextValue = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used inside Tabs')
  return context
}

function Tabs({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('overview')
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="demo-stack">{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: ReactNode }) {
  return <div className="segmented-control">{children}</div>
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs()
  return (
    <button
      type="button"
      className={activeTab === id ? 'selected' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { activeTab } = useTabs()
  if (activeTab !== id) return null
  return <div className="status-box">{children}</div>
}

export default function CompoundComponentsExample() {
  return (
    <Tabs>
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="questions">Questions</Tab>
      </TabList>
      <TabPanel id="overview">Compound components share state through context.</TabPanel>
      <TabPanel id="questions">This pattern is common for Tabs and Accordions.</TabPanel>
    </Tabs>
  )
}
