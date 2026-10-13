# Role Based Access Control

## Interview Definition

Role-based access control, or RBAC, grants permissions based on a user's role.

## Deep Explanation

Frontend RBAC controls what users see and can click. Backend authorization must still enforce permissions because frontend checks can be bypassed.

## Example Used In This Folder

`RoleBasedAccessControlExample.tsx` maps roles to permissions and renders a delete button only for admins.

## Common Interview Questions

Is hiding a button enough for security?

No. The backend must reject unauthorized actions.

What is the difference between role and permission?

A role groups permissions. A permission describes a specific allowed action.

Where should permission data come from?

Usually from authenticated user/session data returned by the backend.

## Common Mistakes

Hardcoding sensitive authorization only in the UI.

Mixing UI labels with permission logic.

Forgetting to handle unknown or changed roles.

## Best Practices

Use backend authorization.

Keep permission checks centralized.

Render UI based on permissions, not only role names.

## Quick Revision Notes

Roles group permissions.

Frontend improves UX.

Backend enforces security.
