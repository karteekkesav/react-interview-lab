# Portals

## Interview Definition

Portals let React render a component's UI into a different DOM node while preserving React ownership, props, state, and event handling.

## Deep Explanation

Portals are useful when visual UI must escape parent containers, such as modals, popovers, dropdowns, and tooltips. They help avoid clipping from `overflow: hidden` and stacking context issues.

React events from portal content still bubble through the React component tree.

## Example Used In This Folder

`PortalsExample.tsx` renders a modal into `document.body` using `createPortal`.

## Common Interview Questions

Why use portals for modals?

To render modal UI outside parent layout constraints while keeping it connected to React state.

Do portal events still work with React?

Yes. Events bubble through the React tree, not only the DOM tree.

What should you consider for modal accessibility?

Use dialog roles, focus management, escape key handling, and background interaction control.

## Common Mistakes

Rendering modal markup inside clipped containers.

Ignoring focus management.

Forgetting to close modals on expected user actions.

## Best Practices

Use portals for overlays.

Handle accessibility carefully.

Keep modal state in a predictable owner component.

## Quick Revision Notes

Portals render outside parent DOM.

React ownership remains.

Common for modals and overlays.
