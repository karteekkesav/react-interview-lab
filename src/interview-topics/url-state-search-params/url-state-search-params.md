# URL State And Search Params

## Interview Definition

URL state stores UI state such as filters, tabs, search text, and pagination in the URL so it can be shared, bookmarked, and restored.

## Deep Explanation

Search params are useful when state should survive refresh, browser back/forward, or link sharing. Not every state belongs in the URL. Modal drafts and private form input usually stay local.

## Example Used In This Folder

`UrlStateSearchParamsExample.tsx` stores the selected topic in `?topic=...` using React Router's `useSearchParams`.

## Common Interview Questions

What UI state belongs in the URL?

Shareable state like filters, search terms, sorting, page number, and selected tabs.

What should not go in the URL?

Sensitive data, large objects, and temporary form drafts.

Why use search params instead of local state?

The state becomes bookmarkable, refresh-safe, and shareable.

## Common Mistakes

Putting sensitive data in URLs.

Storing large JSON in query strings.

Forgetting to sync defaults with missing params.

## Best Practices

Use URL state for shareable view state.

Keep values small and readable.

Validate and default missing or invalid params.

## Quick Revision Notes

URL state is shareable.

Search params are good for filters.

Do not store secrets in URLs.
