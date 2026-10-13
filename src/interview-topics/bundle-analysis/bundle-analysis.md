# Bundle Analysis

## Interview Definition

Bundle analysis inspects the JavaScript and CSS shipped to users so teams can reduce load cost and improve performance.

## Deep Explanation

Bundle analysis helps find large dependencies, duplicate packages, missing code splitting, unused code, and chunks that load too early.

## Example Used In This Folder

`BundleAnalysisExample.tsx` lists common bundle review targets.

## Common Interview Questions

Why analyze bundles?

To understand what users download and identify optimization opportunities.

What can increase bundle size?

Large libraries, duplicate dependencies, unused code, and importing entire packages.

How do you reduce bundle size?

Code split, lazy load, tree shake, replace heavy libraries, and avoid unnecessary dependencies.

## Common Mistakes

Optimizing without measuring.

Ignoring dependency size.

Lazy loading tiny components for no benefit.

## Best Practices

Measure bundle size regularly.

Set performance budgets.

Load heavy features on demand.

## Quick Revision Notes

Measure shipped code.

Find heavy dependencies.

Code split intentionally.
