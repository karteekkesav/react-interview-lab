# Streaming SSR

## Interview Definition

Streaming SSR sends server-rendered HTML to the browser progressively instead of waiting for the whole page to finish rendering.

## Deep Explanation

Streaming can improve perceived performance because the user can see the shell or ready sections earlier. Suspense boundaries help decide which parts can stream later with fallback UI.

## Example Used In This Folder

`StreamingSsrExample.tsx` shows the mental sequence of streaming SSR.

## Common Interview Questions

Why stream HTML?

To show useful content sooner and avoid waiting for every data dependency.

How does Suspense relate?

Suspense boundaries allow parts of the page to wait while other parts stream.

Is streaming the same as hydration?

No. Streaming sends HTML. Hydration attaches client interactivity.

## Common Mistakes

Assuming streaming solves all slow data problems.

Using one huge Suspense boundary.

Forgetting loading states for streamed sections.

## Best Practices

Place Suspense boundaries around meaningful sections.

Prioritize above-the-fold content.

Keep hydration cost in mind.

## Quick Revision Notes

HTML can arrive progressively.

Suspense defines waiting sections.

Hydration still happens on the client.
