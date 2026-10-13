# Feature Flags

## Interview Definition

Feature flags let teams turn features on or off without redeploying code.

## Deep Explanation

Flags support gradual rollouts, A/B tests, kill switches, user targeting, and safer releases. They can come from config files, backend services, or dedicated flag platforms.

## Example Used In This Folder

`FeatureFlagsExample.tsx` toggles a beta search feature while another feature remains enabled.

## Common Interview Questions

Why use feature flags?

To release code safely, test features, and disable risky behavior quickly.

Where should flags come from?

Often from a backend or feature flag service so they can change without rebuilding.

What is flag debt?

Old flags left in the codebase after rollout, making code harder to maintain.

## Common Mistakes

Leaving stale flags forever.

Putting security-sensitive access only behind frontend flags.

Scattering flag checks everywhere.

## Best Practices

Centralize flag access.

Remove flags after rollout.

Use backend enforcement for sensitive behavior.

## Quick Revision Notes

Flags decouple deploy from release.

Useful for rollouts and kill switches.

Clean up old flags.
