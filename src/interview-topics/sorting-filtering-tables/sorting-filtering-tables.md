# Sorting And Filtering Tables

## Interview Definition

Sorting and filtering tables derive visible rows from source data plus query, filter, and sort state.

## Deep Explanation

The source data should stay unchanged. The visible rows should be derived with filtering and sorting. For server-backed tables, the same state may be sent to the backend instead.

## Example Used In This Folder

`SortingFilteringTablesExample.tsx` filters candidates by name and sorts by score.

## Common Interview Questions

Should filtered rows be stored in state?

Usually no. Store query and sort state, then derive rows.

When should sorting happen on the server?

For large datasets or server-paginated tables.

What should happen when filters change?

Often reset pagination to page one.

## Common Mistakes

Mutating the original array with `sort`.

Storing duplicate derived rows.

Ignoring empty results.

## Best Practices

Keep source data immutable.

Derive visible rows.

Use server-side operations for large data.

## Quick Revision Notes

Query and sort are state.

Rows are derived.

Copy before sorting.
