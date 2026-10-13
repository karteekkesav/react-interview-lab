# Props

## Interview Definition

Props are read-only inputs passed from a parent component to a child component. They let components receive data, callback functions, configuration, and children while keeping data flow predictable.

## Deep Explanation

React uses one-way data flow. A parent owns some data and passes it down to children through props. The child can read those props, but it should not mutate them. If a child needs to change parent-owned data, the parent passes a callback prop, and the child calls that callback.

With TypeScript, props are usually described with a `type` or `interface`. This makes interview answers stronger because you can explain both the React concept and the contract between components.

## Example Used In This Folder

`PropsExample.tsx` renders movie cards. The parent passes a `movie` object and an `onToggleWatched` callback into each `MovieCard`.

The important interview point is this: `MovieCard` does not own the movie list. It only displays data and notifies the parent when the user clicks the button.

## Common Interview Questions

What are props in React?

Props are read-only values passed from parent to child components.

Can a child component modify props?

No. Props should be treated as immutable. The child should call a function passed from the parent if it needs to request a change.

What is prop drilling?

Prop drilling happens when props are passed through many intermediate components only so a deeply nested child can use them.

How do props and state differ?

Props are received from outside the component. State is owned and updated inside the component.

## Common Mistakes

Mutating objects received through props.

Passing too many unrelated props instead of grouping data clearly.

Calling a callback during render instead of passing a function reference to an event handler.

## Best Practices

Keep props explicit and typed.

Pass callbacks with clear names like `onSelectMovie` or `onToggleWatched`.

Keep presentational components focused on rendering and event notification.

## Quick Revision Notes

Props are read-only.

Data flows parent to child.

Callbacks let children communicate user actions upward.
