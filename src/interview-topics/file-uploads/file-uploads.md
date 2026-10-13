# File Uploads

## Interview Definition

File uploads let users select local files so the app can validate, preview, and send them to a server.

## Deep Explanation

In React, file inputs are usually uncontrolled because browsers restrict programmatic file value control for security. You read selected files from `event.target.files`.

Production uploads often use `FormData`, progress indicators, size/type validation, retry handling, and signed upload URLs.

## Example Used In This Folder

`FileUploadsExample.tsx` reads the first selected file, validates size, and displays upload-ready metadata.

## Common Interview Questions

Why are file inputs usually uncontrolled?

The browser controls file selection for security. React should read the selected file instead of controlling the value.

How do you upload a file?

Create `FormData`, append the file, and send it with `fetch` or an upload client.

What validations matter?

File size, file type, required files, preview safety, and server-side validation.

## Common Mistakes

Trusting only client-side validation.

Trying to store large file contents in React state.

Forgetting upload progress and failure states.

## Best Practices

Store metadata in state, not large file contents.

Validate on both client and server.

Use `FormData` or signed URLs for real uploads.

## Quick Revision Notes

Read files from `event.target.files`.

Use client and server validation.

File inputs are special browser-controlled inputs.
