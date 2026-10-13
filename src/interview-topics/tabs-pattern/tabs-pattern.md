# Tabs Pattern

## Interview Definition

Tabs switch between related content panels while keeping the user in the same page context.

## Deep Explanation

Tabs need active tab state, tab buttons, and a visible panel. Production tabs should support keyboard navigation, roles, selected state, and focus management.

## Example Used In This Folder

`TabsPatternExample.tsx` stores active tab ID and renders the selected panel.

## Common Interview Questions

What state do tabs need?

The active tab ID or index.

When should tabs be routes?

When each tab should be bookmarkable or shareable.

What keyboard behavior matters?

Arrow key navigation and focus management.

## Common Mistakes

Using tabs for unrelated navigation.

Not indicating the active tab.

Ignoring keyboard support.

## Best Practices

Use IDs instead of fragile indexes when possible.

Use URL state for shareable tabs.

Add accessible roles and keyboard handling in production.

## Quick Revision Notes

Active tab is state.

Panel follows active tab.

URL tabs are shareable.
