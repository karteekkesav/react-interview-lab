# XSS Prevention

## Interview Definition

Cross-site scripting, or XSS, happens when attackers inject scripts into pages viewed by other users.

## Deep Explanation

React escapes string values by default, which helps prevent many XSS bugs. Risk increases when using `dangerouslySetInnerHTML`, inserting third-party HTML, unsafe URLs, or bypassing sanitization.

## Example Used In This Folder

`XssPreventionExample.tsx` renders a malicious-looking string as safe text because React escapes it.

## Common Interview Questions

Does React prevent all XSS?

No. It escapes text by default, but unsafe HTML rendering and unsafe URLs can still introduce XSS.

When is `dangerouslySetInnerHTML` risky?

When rendering untrusted HTML without sanitization.

How do you prevent XSS?

Escape output, sanitize HTML, validate URLs, use CSP, and avoid storing tokens in XSS-readable places.

## Common Mistakes

Rendering untrusted HTML.

Trusting user-generated rich text.

Putting sensitive tokens in localStorage.

## Best Practices

Avoid raw HTML when possible.

Sanitize trusted rich text with proven libraries.

Use Content Security Policy as defense in depth.

## Quick Revision Notes

React escapes text.

Raw HTML is risky.

Sanitize untrusted content.
