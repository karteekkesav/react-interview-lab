# Performance

## Interview Definition

React performance work means reducing unnecessary rendering, expensive recalculations, large bundle cost, and slow user interactions while keeping the code correct.

## Deep Explanation

Not every re-render is bad. React is designed to re-render. Performance work should focus on real bottlenecks: expensive calculations, very large lists, unstable props passed to memoized children, unnecessary global state updates, and heavy components.

Common tools include `React.memo`, `useMemo`, `useCallback`, virtualization, code splitting, and profiling.

## Example Used In This Folder

`PerformanceExample.tsx` uses `useMemo` for derived filtered data and `memo` for `SkillRow`. This shows the relationship between stable data, memoized child components, and render optimization.

## Common Interview Questions

What does `React.memo` do?

It memoizes a component and skips re-rendering when its props are shallowly equal.

Does `React.memo` stop all renders?

No. It only helps when props are equal. Context changes or changed props still re-render the component.

When should you optimize React performance?

When there is a measured issue or an obvious expensive path, not by default everywhere.

## Common Mistakes

Using memoization everywhere.

Passing new object or function props to memoized children and expecting them not to re-render.

Optimizing before identifying the actual bottleneck.

## Best Practices

Measure first with React DevTools Profiler or browser tools.

Keep state close to where it is needed.

Use virtualization for large lists.

## Quick Revision Notes

Re-renders are not automatically bad.

`React.memo` compares props.

Optimize measured bottlenecks.
