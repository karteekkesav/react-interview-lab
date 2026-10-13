import { useMemo, useState } from 'react'

const rows = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`)
const rowHeight = 36
const viewportHeight = 180

export default function VirtualizedListsExample() {
  const [scrollTop, setScrollTop] = useState(0)
  const startIndex = Math.floor(scrollTop / rowHeight)
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + 2

  const visibleRows = useMemo(
    () => rows.slice(startIndex, startIndex + visibleCount),
    [startIndex, visibleCount],
  )

  return (
    <div
      className="virtual-list"
      style={{ height: viewportHeight }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div style={{ height: rows.length * rowHeight, position: 'relative' }}>
        {visibleRows.map((row, index) => (
          <div
            className="virtual-row"
            key={row}
            style={{
              height: rowHeight,
              top: (startIndex + index) * rowHeight,
            }}
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}
