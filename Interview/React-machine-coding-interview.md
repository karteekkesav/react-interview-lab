# React Machine Coding Interview Notes

Purpose: quick practice for common React machine-coding rounds using simple JavaScript/JSX examples.

## Machine Coding Mental Model

```text
Understand requirement
        |
        v
Identify state
        |
        v
Build UI
        |
        v
Handle events
        |
        v
Add edge cases
        |
        v
Explain trade-offs
```

Interview approach:

1. Clarify expected behavior.
2. Identify state variables.
3. Keep components small.
4. Handle loading, error, and empty states when APIs are involved.
5. Explain performance improvements after the basic version works.

## Counter

```jsx
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
```

Interview points:

- `count` is local component state.
- Button clicks update state.
- React re-renders the component after state changes.

## Counter With Functional Update

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function incrementThreeTimes() {
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
    setCount((prev) => prev + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={incrementThreeTimes}>+3</button>
    </div>
  )
}
```

Use functional updates when the next state depends on the previous state.

## Todo List

```jsx
import { useState } from "react"

export default function TodoApp() {
  const [text, setText] = useState("")
  const [todos, setTodos] = useState([])

  function addTodo() {
    if (!text.trim()) return

    setTodos([
      ...todos,
      { id: Date.now(), title: text, completed: false },
    ])
    setText("")
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? "line-through" : "none" }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Interview points:

- Add, update, and delete are immutable operations.
- `key` helps React identify list items.
- Empty input is handled.

## Debounce

Use debounce when the user is typing and you want to wait before calling an API.

```jsx
import { useEffect, useState } from "react"

export default function SearchBox() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timerId)
  }, [search])

  useEffect(() => {
    if (!debouncedSearch) return
    console.log("Call API with:", debouncedSearch)
  }, [debouncedSearch])

  return (
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search users"
    />
  )
}
```

Visual model:

```text
User types: k -> ka -> kar
        clear old timers
        wait 500ms
        call API once with "kar"
```

## Throttle

Use throttle when you want to run a function at most once in a fixed time window.

```jsx
function throttle(callback, delay) {
  let waiting = false

  return function (...args) {
    if (waiting) return

    callback(...args)
    waiting = true

    setTimeout(() => {
      waiting = false
    }, delay)
  }
}

const handleScroll = throttle(() => {
  console.log("Scroll event handled")
}, 1000)
```

Interview answer:

Debounce waits until the user stops. Throttle runs at a controlled interval.

Main difference:

```text
Debounce:
Wait until events stop, then run once.

Throttle:
Run at regular intervals while events continue.
```

| Feature | Debounce | Throttle |
| --- | --- | --- |
| Runs when | After user stops | At fixed intervals |
| Best for | Search input | Scroll/resize |
| API calls | Reduces calls until typing stops | Limits calls over time |
| Example | Search after 500ms pause | Track scroll every 500ms |

Best interview answer:

> Debounce delays execution until the event stops firing for a specified delay. Throttle limits execution to once per interval while the event continues firing. I use debounce for search/autocomplete API calls and throttle for scroll or resize listeners.

## Search With API Failure Handling

```jsx
import { useEffect, useState } from "react"

export default function UserSearch() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!query) {
      setUsers([])
      return
    }

    const controller = new AbortController()

    async function searchUsers() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`/api/users?q=${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Failed to search users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    searchUsers()

    return () => controller.abort()
  }, [query])

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
```

Interview points:

- Handles loading, error, and success.
- Cancels stale requests using `AbortController`.
- Prevents old API responses from updating the UI after the query changes.

## Pagination

```jsx
import { useEffect, useState } from "react"

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`/api/products?page=${page}`)
      .then((response) => response.json())
      .then(setProducts)
  }, [page])

  return (
    <div>
      {products.map((product) => (
        <p key={product.id}>{product.title}</p>
      ))}

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  )
}
```

Interview improvement:

For real projects, use TanStack Query or RTK Query to cache pages by query key.

```text
["products", 1] -> page 1 cache
["products", 2] -> page 2 cache
["products", 3] -> page 3 cache
```

## Infinite Scroll

```jsx
import { useEffect, useRef, useState } from "react"

export default function InfiniteProducts() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const loaderRef = useRef(null)

  useEffect(() => {
    fetch(`/api/products?page=${page}`)
      .then((response) => response.json())
      .then((data) => setItems((prev) => [...prev, ...data]))
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1)
      }
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {items.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}
      <div ref={loaderRef}>Loading more...</div>
    </div>
  )
}
```

Interview points:

- `IntersectionObserver` detects when the loader becomes visible.
- New pages are appended to existing items.
- For large lists, combine infinite scroll with virtualization.

## Modal

```jsx
import { useState } from "react"

export default function ModalExample() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      {open && (
        <div role="dialog" aria-modal="true">
          <h2>Delete item?</h2>
          <p>This action cannot be undone.</p>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Confirm</button>
        </div>
      )}
    </div>
  )
}
```

Interview improvements:

- Close on Escape.
- Trap focus inside the modal.
- Restore focus to the trigger button.

## Tabs

```jsx
import { useState } from "react"

const tabs = ["Profile", "Documents", "Settings"]

export default function TabsExample() {
  const [activeTab, setActiveTab] = useState("Profile")

  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          aria-selected={activeTab === tab}
        >
          {tab}
        </button>
      ))}

      <h2>{activeTab}</h2>
    </div>
  )
}
```

## Accordion

```jsx
import { useState } from "react"

const faqs = [
  { id: 1, question: "What is React?", answer: "A UI library." },
  { id: 2, question: "What is state?", answer: "Data that changes over time." },
]

export default function Accordion() {
  const [openId, setOpenId] = useState(null)

  return (
    <div>
      {faqs.map((faq) => (
        <section key={faq.id}>
          <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
            {faq.question}
          </button>
          {openId === faq.id && <p>{faq.answer}</p>}
        </section>
      ))}
    </div>
  )
}
```

## Stepper Form

```jsx
import { useState } from "react"

export default function StepperForm() {
  const [step, setStep] = useState(1)

  return (
    <div>
      <p>Step {step} of 3</p>

      {step === 1 && <h2>Personal Details</h2>}
      {step === 2 && <h2>Document Upload</h2>}
      {step === 3 && <h2>Review</h2>}

      <button disabled={step === 1} onClick={() => setStep(step - 1)}>
        Back
      </button>
      <button disabled={step === 3} onClick={() => setStep(step + 1)}>
        Next
      </button>
    </div>
  )
}
```

Resume-style explanation:

This is similar to onboarding flows where users move from personal details to POI/POA upload and final review.

## File Upload Validation

```jsx
import { useState } from "react"

export default function FileUpload() {
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")

  function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG, and PNG files are allowed")
      return
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5 MB")
      return
    }

    setError("")
    setFileName(file.name)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {fileName && <p>Selected: {fileName}</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
```

Interview answer:

For POI/POA upload in real projects, validate file type and size on the frontend, but always validate again on the backend. For large files, use pre-signed URLs or direct cloud upload.

## Two Sum

```js
function twoSum(numbers, target) {
  const seen = new Map()

  for (let i = 0; i < numbers.length; i++) {
    const needed = target - numbers[i]

    if (seen.has(needed)) {
      return [seen.get(needed), i]
    }

    seen.set(numbers[i], i)
  }

  return []
}

console.log(twoSum([2, 7, 11, 15], 9))
```

Time complexity: `O(n)`.

## Flatten Nested Array

```js
function flattenArray(arr) {
  const result = []

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item))
    } else {
      result.push(item)
    }
  }

  return result
}

console.log(flattenArray([1, [2, [3, 4]], 5]))
```

## Group Array By Property

```js
function groupBy(items, key) {
  return items.reduce((grouped, item) => {
    const groupKey = item[key]

    if (!grouped[groupKey]) {
      grouped[groupKey] = []
    }

    grouped[groupKey].push(item)
    return grouped
  }, {})
}

const users = [
  { name: "Asha", role: "admin" },
  { name: "Ravi", role: "user" },
  { name: "Karteek", role: "admin" },
]

console.log(groupBy(users, "role"))
```

## Remove Duplicates

```js
function removeDuplicates(numbers) {
  return [...new Set(numbers)]
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 4]))
```

For objects:

```js
function removeDuplicateUsers(users) {
  const map = new Map()

  for (const user of users) {
    map.set(user.id, user)
  }

  return Array.from(map.values())
}
```

## Basic LRU Cache

```js
class LRUCache {
  constructor(limit) {
    this.limit = limit
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return -1

    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    this.cache.set(key, value)

    if (this.cache.size > this.limit) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
  }
}

const cache = new LRUCache(2)
cache.put("page-1", ["A", "B"])
cache.put("page-2", ["C", "D"])
console.log(cache.get("page-1"))
cache.put("page-3", ["E", "F"])
```

Visual model:

```text
Most recently used items stay
Least recently used item is removed when cache is full
```

## Interview Checklist

- Explain state before coding.
- Use clear component names.
- Handle empty and error states.
- Use stable keys in lists.
- Avoid mutating arrays and objects directly.
- Add cleanup for timers, observers, and subscriptions.
- Mention pagination, caching, virtualization, and debouncing for performance-heavy screens.
- Explain what you would improve in production after the basic version works.

## Quick Summary

- Counter checks state basics.
- Todo checks CRUD operations and immutable updates.
- Debounce and throttle check event performance.
- Search checks API handling and stale request cancellation.
- Pagination and infinite scroll check large data handling.
- Modal, tabs, accordion, and stepper check UI component design.
- File upload connects directly to POI/POA real project scenarios.
