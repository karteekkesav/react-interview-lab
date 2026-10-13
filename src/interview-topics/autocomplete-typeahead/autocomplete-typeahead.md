# Autocomplete Typeahead

## Interview Definition

Autocomplete, or typeahead, suggests matching options as the user types and often supports keyboard selection.

## Deep Explanation

A strong typeahead handles query state, filtered results, selected index, keyboard navigation, empty states, debouncing for remote data, and accessibility roles.

## Example Used In This Folder

`AutocompleteTypeaheadExample.tsx` filters a topic list and supports Arrow Up, Arrow Down, and Enter selection.

## Common Interview Questions

What state does autocomplete need?

Query, suggestions, active index, open state, loading state for remote data, and selected value.

How do you handle remote autocomplete?

Debounce the query, fetch suggestions, handle loading and stale responses.

What keyboard behavior matters?

Arrow navigation, Enter selection, Escape close, and focus management.

## Common Mistakes

Only supporting mouse interaction.

Calling the API on every keystroke without debounce.

Ignoring empty and loading states.

## Best Practices

Support keyboard navigation.

Debounce remote searches.

Use accessible combobox patterns for production.

## Quick Revision Notes

Query filters suggestions.

Active index tracks keyboard selection.

Remote typeahead needs debounce and stale request handling.
