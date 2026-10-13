# Cookies

## Interview Definition

Cookies are small key-value data stored by the browser and sent with matching HTTP requests.

## Deep Explanation

Cookies are often used for sessions and authentication. Security attributes matter: `HttpOnly`, `Secure`, `SameSite`, `Path`, `Domain`, and expiration settings.

Frontend JavaScript cannot read `HttpOnly` cookies, which is useful for protecting session tokens from XSS.

## Example Used In This Folder

`CookiesExample.tsx` sets and reads a non-HttpOnly demo cookie. Real auth cookies should usually be set by the server.

## Common Interview Questions

What is `HttpOnly`?

It prevents JavaScript from reading the cookie.

What is `SameSite`?

It controls when cookies are sent with cross-site requests.

Are cookies always more secure than localStorage?

Not automatically. Correct cookie attributes and backend protections matter.

## Common Mistakes

Storing sensitive auth tokens in browser-readable cookies.

Ignoring CSRF considerations.

Forgetting cookie expiration and path rules.

## Best Practices

Use `HttpOnly`, `Secure`, and `SameSite` for auth cookies.

Let the backend set sensitive cookies.

Understand CSRF and XSS tradeoffs.

## Quick Revision Notes

Cookies are sent with requests.

HttpOnly blocks JS access.

Auth cookies need secure attributes.
