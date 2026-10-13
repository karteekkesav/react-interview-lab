# Reusable Table Pattern

## Interview Definition

A reusable table pattern separates row data from column configuration so the table can render different datasets consistently.

## Deep Explanation

Production tables often need columns, custom cell renderers, sorting, filtering, pagination, loading, empty states, row actions, and accessibility.

## Example Used In This Folder

`ReusableTablePatternExample.tsx` defines `columns` with headers and render functions, then maps rows through those columns.

## Common Interview Questions

Why use column configuration?

It makes table rendering reusable and keeps cell logic explicit.

What states should a table support?

Loading, empty, error, filtered, paginated, and selected states.

When use a table library?

For complex enterprise tables with sorting, virtualization, pinning, and selection.

## Common Mistakes

Hardcoding every table.

Ignoring empty states.

Using divs where semantic table markup is better.

## Best Practices

Use semantic table markup for tabular data.

Keep column definitions typed.

Separate data logic from presentation.

## Quick Revision Notes

Columns define rendering.

Rows provide data.

Tables need empty/loading states.
