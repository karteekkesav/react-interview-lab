# Dropdown Menu Pattern

## Interview Definition

A dropdown menu reveals a list of contextual actions from a trigger button.

## Deep Explanation

Production dropdowns need open state, outside click handling, escape key close, focus management, keyboard navigation, positioning, and accessible menu semantics.

## Example Used In This Folder

`DropdownMenuPatternExample.tsx` toggles a small action menu and closes it after an action.

## Common Interview Questions

What state does a dropdown need?

Open state, selected action if needed, and sometimes focused item index.

How should it close?

On action selection, outside click, Escape key, or route change.

What accessibility matters?

Trigger semantics, menu roles, focus management, and keyboard navigation.

## Common Mistakes

Not closing after selection.

Ignoring outside clicks and Escape.

Using inaccessible divs for actions.

## Best Practices

Use a button as the trigger.

Close predictably.

Use a library for complex menus.

## Quick Revision Notes

Trigger controls open state.

Menu contains actions.

Focus management matters.
