# Forms

## Interview Definition

React forms usually use controlled components, where form input values are stored in React state and updated through `onChange` handlers.

## Deep Explanation

Controlled inputs make the React state the source of truth. This gives you predictable validation, conditional submit behavior, formatting, and reset logic.

For large forms, teams often use form libraries, but understanding controlled inputs is still essential for interviews.

## Example Used In This Folder

`FormsExample.tsx` stores name, email, and role in a single state object. Each input updates one field. The submit handler prevents the browser default page reload, validates the form, and stores the submitted result.

## Common Interview Questions

What is a controlled component?

A controlled component is an input whose value is controlled by React state.

Why call `event.preventDefault()` on form submit?

It prevents the browser from reloading the page so React can handle the submission.

How do you validate forms in React?

You can derive validation from current state and use that validation to show messages, disable buttons, or block submit.

## Common Mistakes

Mixing controlled and uncontrolled behavior for the same input.

Forgetting `name`, `value`, or `onChange` patterns when managing multiple fields.

Putting all validation only inside submit logic and giving no useful UI feedback.

## Best Practices

Use controlled inputs for important application forms.

Keep validation derived from state where possible.

Use libraries for complex enterprise forms, but know the underlying controlled input model.

## Quick Revision Notes

Controlled input equals value plus onChange.

Prevent default form submit behavior.

Validation can be derived from form state.
