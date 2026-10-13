# Browser Storage Comparison

## Interview Definition

Browser storage options let frontend apps persist different kinds of data in the browser.

## Deep Explanation

Common options include localStorage, sessionStorage, cookies, IndexedDB, and in-memory state. Each has different lifetime, size, security, and server visibility tradeoffs.

## Example Used In This Folder

`BrowserStorageComparisonExample.tsx` compares common storage choices and typical use cases.

## Common Interview Questions

When use localStorage?

For small non-sensitive persistent client preferences.

When use cookies?

When the server must receive the value, especially secure HTTP-only auth cookies.

When use IndexedDB?

For larger structured offline data.

## Common Mistakes

Storing secrets in localStorage.

Using localStorage for large data.

Forgetting cookies are sent with requests.

## Best Practices

Do not store secrets in browser-readable storage.

Use HTTP-only secure cookies for many auth flows.

Choose storage based on lifetime, size, and security.

## Quick Revision Notes

localStorage persists.

sessionStorage is tab-scoped.

Cookies can be server-readable.
