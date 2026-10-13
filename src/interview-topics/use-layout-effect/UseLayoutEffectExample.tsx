import { useLayoutEffect, useRef, useState } from 'react'

export default function UseLayoutEffectExample() {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    setWidth(boxRef.current?.getBoundingClientRect().width ?? 0)
  }, [])

  return (
    <div className="demo-stack">
      <div ref={boxRef} className="status-box">
        Measure this box before paint.
      </div>
      <p className="status-box">
        <strong>Measured width:</strong> {Math.round(width)}px
      </p>
    </div>
  )
}
