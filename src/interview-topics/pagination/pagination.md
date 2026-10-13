# Pagination

## Interview Definition

Pagination splits a large collection into smaller pages and lets users move between those pages.

## Deep Explanation

Pagination can be client-side or server-side. Client-side pagination slices an already-loaded array. Server-side pagination requests one page at a time from the backend using page numbers, offsets, or cursors.

Interviewers often ask pagination because it combines state, derived data, disabled buttons, boundaries, and list rendering.

## Example Used In This Folder

`PaginationExample.tsx` stores the current page in state, calculates total pages, derives visible questions with `slice`, and disables previous or next buttons at boundaries.

## Common Interview Questions

What state is needed for pagination?

Usually current page, page size, total count, and sometimes loading or error state for server pagination.

What is the difference between offset and cursor pagination?

Offset uses page or skip counts. Cursor uses a stable pointer from the backend and is better for frequently changing datasets.

Should visible page items be stored in state?

Usually no. They can be derived from source data and current page.

## Common Mistakes

Not disabling boundary buttons.

Storing derived visible items in separate state.

Forgetting to reset page when filters change.

## Best Practices

Derive visible data from page and source data.

Handle empty and boundary states.

Use server pagination for large datasets.

## Quick Revision Notes

Page is state.

Visible rows are derived.

Disable previous and next at boundaries.
