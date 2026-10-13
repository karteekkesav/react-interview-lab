# Controlled Vs Uncontrolled

## Interview Definition

A controlled input is managed by React state. An uncontrolled input is managed by the DOM and usually read with a ref when needed.

## Deep Explanation

Controlled inputs use `value` and `onChange`, making React the source of truth. This is ideal for validation, conditional UI, formatting, and predictable submit behavior.

Uncontrolled inputs keep their own DOM state. They can be useful for simple forms, file inputs, or integrating with non-React code.

## Example Used In This Folder

`ControlledUncontrolledExample.tsx` shows both patterns side by side. The controlled input updates React state on every keystroke. The uncontrolled input is read only when the button is clicked.

## Common Interview Questions

Which pattern is preferred in React forms?

Controlled inputs are preferred for important forms because they are predictable and easier to validate.

When would you use uncontrolled inputs?

For simple forms, file inputs, or when integrating with DOM-focused libraries.

Can an input switch between controlled and uncontrolled?

Avoid switching. It usually indicates a bug and React warns about it.

## Common Mistakes

Using `value` without `onChange`.

Mixing `defaultValue` and `value` incorrectly.

Trying to control file inputs like text inputs.

## Best Practices

Use controlled inputs for validation-heavy forms.

Use refs for uncontrolled reads.

Keep each input consistently controlled or uncontrolled.

## Quick Revision Notes

Controlled equals React state.

Uncontrolled equals DOM state.

Refs read uncontrolled values.
