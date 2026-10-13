# useLayoutEffect

## Interview Definition

`useLayoutEffect` runs after React updates the DOM but before the browser paints, making it useful for layout measurement and synchronous visual adjustments.

## Deep Explanation

Most effects should use `useEffect`. Use `useLayoutEffect` only when the user would see a visual flicker if the work happened after paint.

## Example Used In This Folder

`UseLayoutEffectExample.tsx` measures a DOM element's width before paint.

## Common Interview Questions

How is `useLayoutEffect` different from `useEffect`?

`useLayoutEffect` runs before paint. `useEffect` runs after paint.

When should you use it?

For layout measurement or synchronous DOM adjustments that must happen before paint.

Can it hurt performance?

Yes. It blocks painting, so overuse can make the UI feel slower.

## Common Mistakes

Using it for normal API calls.

Replacing every effect with layout effect.

Doing expensive work before paint.

## Best Practices

Default to `useEffect`.

Use layout effect only for visual measurement.

Keep the work small.

## Quick Revision Notes

Runs before paint.

Good for measuring layout.

Can block rendering.
