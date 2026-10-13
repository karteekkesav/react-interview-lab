# CSRF Concepts

## Interview Definition

Cross-site request forgery, or CSRF, tricks a user's browser into sending an authenticated request to another site.

## Deep Explanation

CSRF is especially relevant for cookie-based authentication because browsers automatically send matching cookies with requests. Common protections include SameSite cookies, CSRF tokens, checking Origin or Referer headers, and avoiding state-changing GET requests.

## Example Used In This Folder

`CsrfConceptsExample.tsx` lists common CSRF protections.

## Common Interview Questions

Why does CSRF relate to cookies?

Browsers automatically attach cookies to matching requests.

What does SameSite help with?

It limits when cookies are sent on cross-site requests.

Do bearer tokens in memory have the same CSRF risk?

Usually less, because the browser does not automatically attach them unless your code does.

## Common Mistakes

Using GET for state-changing actions.

Ignoring SameSite behavior.

Assuming CORS alone solves CSRF.

## Best Practices

Use SameSite cookies.

Use CSRF tokens for sensitive cookie-auth flows.

Validate request origin on the server.

## Quick Revision Notes

CSRF abuses automatic credentials.

SameSite helps.

Backend protection is required.
