# useTransition

## Interview Definition

`useTransition` marks state updates as non-urgent so React can keep urgent updates, such as typing, responsive while heavier UI updates happen in the background.

## Deep Explanation

Use it when one update must feel immediate and another update can lag slightly. A common example is updating the input value immediately while deferring a large results list update.

## Example Used In This Folder

`UseTransitionExample.tsx` contains two examples:

1. Search filter example
2. Generated list example

Both examples keep the input state urgent and move the heavier UI update into `startTransition`.

```text
User types
   |
   +-- urgent update -> input value changes immediately
   |
   +-- transition update -> expensive list update happens with lower priority
```

## Example 1: Search Filter

The search example updates the input immediately and transitions the heavier search query update.

## Why `slice(0, 8)` Is Used

The example creates 2500 candidates:

```ts
const items = Array.from({ length: 2500 }, (_, index) => `Candidate ${index + 1}`)
```

Then it filters the list and shows only the first 8 matching results:

```ts
const visibleItems = items
  .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
  .slice(0, 8)
```

Initially, `query` is an empty string:

```ts
const [query, setQuery] = useState("")
```

In JavaScript, every string includes an empty string:

```ts
"Candidate 1".includes("") // true
```

So when the page first loads, the filter matches all 2500 candidates.

Flow:

```text
2500 total items
   |
   | filter with empty query
   v
2500 matched items
   |
   | slice(0, 8)
   v
8 visible items
```

That means `visibleItems` initially contains only:

```ts
[
  "Candidate 1",
  "Candidate 2",
  "Candidate 3",
  "Candidate 4",
  "Candidate 5",
  "Candidate 6",
  "Candidate 7",
  "Candidate 8",
]
```

Important:

The component checks all 2500 values during filtering, but it renders only the first 8 results because of `slice(0, 8)`.

Interview summary:

Initially, the query is empty. Since every string includes an empty string, the filter matches all candidates. Then `slice(0, 8)` limits the rendered UI to the first 8 matching candidates, keeping the demo readable and lightweight.

## Example 2: Generated List

The generated list example is based on this idea:

```tsx
const [search, setSearch] = useState("")
const [list, setList] = useState([])
const [isPending, startTransition] = useTransition()

function handleChange(event) {
  setSearch(event.target.value)

  startTransition(() => {
    const arr = []

    for (let i = 0; i <= 25000; i++) {
      arr.push(event.target.value)
    }

    setList(arr)
  })
}
```

What happens:

```text
User types in input
      |
      +-- setSearch(nextValue)
      |     |
      |     v
      |   urgent update, input stays responsive
      |
      +-- startTransition(...)
            |
            v
          generate large list and update list later
```

Why `useTransition` helps here:

The input update is urgent because the user expects typing to feel immediate. The generated list update is less urgent because it can take more work. `startTransition` tells React that the list update can be interrupted or delayed so the input remains responsive.

Why the UI shows only the first 20 generated items:

The example generates 25,001 values to simulate expensive work, but rendering 25,001 `<li>` elements can freeze the browser and make the learning experience noisy. So the example keeps the generated list in state but renders only a small preview:

```ts
const visibleList = list.slice(0, 20)
```

Interview summary:

In this example, `setSearch` is urgent and should update immediately. `setList` is non-urgent because rendering a large generated list is heavier. Wrapping `setList` inside `startTransition` helps React prioritize the input interaction first.

## Common Interview Questions

What does `useTransition` return?

It returns `isPending` and `startTransition`.

What updates should be transitioned?

Non-urgent updates such as filtering large lists or switching heavy tabs.

Does it make slow code faster?

No. It changes scheduling so urgent interactions stay responsive.

## Common Mistakes

Wrapping the input state itself in a transition.

Using it for every state update.

Expecting it to reduce computation cost.

## Best Practices

Keep urgent state immediate.

Transition expensive non-urgent UI updates.

Show pending feedback when useful.

## Quick Revision Notes

Improves responsiveness.

Does not remove work.

Use for non-urgent updates.
