import { forwardRef, useImperativeHandle, useRef } from 'react'

type SearchInputHandle = {
  focus: () => void
  clear: () => void
}

const SearchInput = forwardRef<SearchInputHandle>(function SearchInput(_, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }))

  return <input ref={inputRef} placeholder="Imperative search input" />
})

export default function ForwardRefExample() {
  const searchRef = useRef<SearchInputHandle | null>(null)

  return (
    <div className="demo-stack">
      <SearchInput ref={searchRef} />
      <div className="button-row">
        <button type="button" onClick={() => searchRef.current?.focus()}>
          Focus
        </button>
        <button type="button" onClick={() => searchRef.current?.clear()}>
          Clear
        </button>
      </div>
    </div>
  )
}
