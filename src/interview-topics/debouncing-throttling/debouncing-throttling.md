# Debouncing And Throttling

## Interview Definition

Debouncing waits until events stop for a delay before running logic. Throttling runs logic at most once within a fixed time window.

## Deep Explanation

Debouncing is common for search input because you usually want to wait until the user pauses typing before calling an API. Throttling is common for scroll, resize, and repeated button actions because you want regular but limited updates.

Both patterns improve performance and reduce unnecessary work.

## Example Used In This Folder

`DebouncingThrottlingExample.tsx` debounces a search input with `useEffect` and throttles a button action with `useRef`.

## Common Interview Questions

When would you use debounce?

For search boxes, autocomplete, validation, and inputs where you wait for the user to pause.

When would you use throttle?

For scroll, resize, mouse move, and other high-frequency events that should update at a steady limit.

Why store throttle time in a ref?

Because the value should persist without causing re-renders.

## Common Mistakes

Calling APIs on every keystroke.

Forgetting to clear debounce timers.

Using state for mutable timer ids or timestamps that do not affect UI.

## Best Practices

Debounce search-like interactions.

Throttle continuous high-frequency events.

Clean up timers in effects.

## Quick Revision Notes

Debounce waits for pause.

Throttle limits frequency.

Refs help store timer metadata.
