# Search Params With Filters

## Interview Definition

Search params with filters store selected filter values in the URL query string.

## Deep Explanation

This is useful for job lists, product listings, dashboards, and tables where users expect filtered views to survive refresh and be shareable.

## Example Used In This Folder

`SearchParamsWithFiltersExample.tsx` stores the selected job type in `?type=...` and derives visible rows from that value.

## Common Interview Questions

Why put filters in the URL?

So filtered views are shareable, bookmarkable, and refresh-safe.

What filters should stay local?

Temporary private drafts or values that are not useful to share.

How do you handle invalid params?

Validate them and fall back to defaults.

## Common Mistakes

Putting sensitive values in query params.

Not preserving unrelated params when updating one filter.

Forgetting defaults for missing params.

## Best Practices

Use URL state for shareable filters.

Keep query values small.

Validate and default params.

## Quick Revision Notes

Filters in URL are shareable.

Params drive derived rows.

Validate query values.
