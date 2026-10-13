# JSX

## Interview Definition

JSX is a syntax extension that lets you describe React UI using markup-like syntax inside JavaScript or TypeScript.

## Deep Explanation

JSX is not HTML. It gets compiled into React function calls. Because JSX lives inside JavaScript, you can use expressions inside curly braces, such as variables, function calls, ternaries, and array methods.

In React, JSX attributes mostly use camelCase, such as `className`, `htmlFor`, and `onClick`. JSX must return one parent element, which can be a fragment.

## Example Used In This Folder

`JsxExample.tsx` renders a candidate profile. It uses JavaScript expressions for a computed label, a conditional message, a joined skills list, and an accessible button label.

## Common Interview Questions

Is JSX required in React?

No. React can be written without JSX, but JSX is the standard because it is readable and productive.

Why do we use `className` instead of `class`?

Because JSX maps closely to JavaScript properties, and `class` is a reserved JavaScript keyword.

Can we use `if` directly inside JSX?

Not directly as a statement. Use a ternary, logical `&&`, or compute the value before the return.

## Common Mistakes

Using `class` instead of `className`.

Returning adjacent elements without a wrapper or fragment.

Putting statements instead of expressions inside curly braces.

## Best Practices

Keep JSX readable by moving complex logic above the return.

Use semantic HTML elements where possible.

Use accessible labels when visible text is not enough.

## Quick Revision Notes

JSX compiles to JavaScript.

Use `{}` for expressions.

JSX attributes are usually camelCase.
