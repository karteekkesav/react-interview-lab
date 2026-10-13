# Machine Coding Patterns

## Interview Definition

Machine coding rounds test whether you can build a small working feature with clean state, readable components, edge cases, and user-friendly behavior within limited time.

## Deep Explanation

Common React machine coding tasks include search, filter, sort, pagination, tabs, accordions, modals, step forms, todo lists, autocomplete, debouncing, infinite scroll, and API-backed lists.

Interviewers usually watch for decomposition, state modeling, edge cases, accessibility, and whether the UI actually works.

## Example Used In This Folder

`MachineCodingPatternsExample.tsx` combines search, category filtering, derived counts, and list rendering. These are building blocks that appear in many machine coding prompts.

## Common Interview Questions

How do you approach a machine coding problem?

Clarify requirements, identify state, create a simple component structure, implement the happy path, then handle edge cases.

What edge cases matter for search and filter?

Empty results, case-insensitive matching, clearing filters, loading states when remote data is involved, and stable keys.

Should filtered data be stored in state?

Usually no. It should be derived from source data plus filter state.

## Common Mistakes

Starting with styling before behavior works.

Duplicating derived state.

Ignoring empty and error states.

Writing one large component with unclear responsibilities.

## Best Practices

Get a working version first.

Keep source data separate from derived filtered data.

Explain tradeoffs as you code.

## Quick Revision Notes

Identify state first.

Derive filtered and sorted data.

Handle empty states and edge cases.
