# Events

## Interview Definition

Events let React components respond to user interactions such as clicks, input changes, form submits, keyboard actions, and focus changes.

## Deep Explanation

React event handlers are passed as function references, not called immediately during render. In TypeScript, event types such as `React.ChangeEvent<HTMLInputElement>` or `React.FormEvent<HTMLFormElement>` help make handlers safer.

React uses a normalized event system, so event handling feels consistent across browsers.

## Example Used In This Folder

`EventsExample.tsx` handles input changes, form submission, and a clear button click. The submit handler calls `preventDefault()` to stop a browser page reload.

## Common Interview Questions

How do you handle a button click in React?

Pass a function to `onClick`, such as `onClick={handleClick}`.

Why should we not write `onClick={handleClick()}`?

That calls the function during render. React needs a function reference to call later when the event happens.

Why use `preventDefault()` in a form submit handler?

It prevents the browser's default page reload and lets React handle the submit.

## Common Mistakes

Calling handlers immediately during render.

Using submit buttons for non-submit actions.

Forgetting correct TypeScript event types.

## Best Practices

Name handlers by intent, like `handleSubmit` or `handleClear`.

Keep event handlers small and readable.

Use `type="button"` for buttons that should not submit a form.

## Quick Revision Notes

Events are passed as callbacks.

Use `preventDefault()` for controlled form submit.

Type event handlers in TSX.
