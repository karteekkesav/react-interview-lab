import { useState, type ReactNode } from 'react'

function Toggle({
  children,
}: {
  children: (state: { isOn: boolean; toggle: () => void }) => ReactNode
}) {
  const [isOn, setIsOn] = useState(false)
  return children({ isOn, toggle: () => setIsOn((value) => !value) })
}

export default function RenderPropsExample() {
  return (
    <Toggle>
      {({ isOn, toggle }) => (
        <div className="demo-stack">
          <p className="status-box">Interview mode is {isOn ? 'on' : 'off'}.</p>
          <button type="button" onClick={toggle}>
            Toggle mode
          </button>
        </div>
      )}
    </Toggle>
  )
}
