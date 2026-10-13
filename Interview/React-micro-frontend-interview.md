# React Micro-Frontend Architecture Interview Guide

Purpose: interview revision with mental models, implementation examples, trade-offs, visual diagrams, and project-based talking points.

## What Is A Micro-Frontend?

A micro-frontend architecture divides a large frontend into business-focused applications that can be owned, developed, tested, and deployed by separate teams.

```text
Frontend monolith
  |
  +-- one repository
  +-- one build
  +-- one deployment
  +-- tightly coordinated releases

Micro-frontend system
  |
  +-- application shell
  +-- onboarding application
  +-- dashboard application
  +-- client-management application
  +-- shared platform packages
```

The objective is organizational and deployment independence. Splitting one UI into many bundles without clear team ownership does not automatically create a good micro-frontend architecture.

Interview answer:

> A micro-frontend applies bounded ownership to the frontend. Each team owns a business capability end to end, while an application shell composes those capabilities into one user experience. The main benefit is independent delivery at scale; the main cost is distributed-system complexity in the browser.

## Mental Model

Think of the browser as a small integration platform:

```text
                         Browser
                            |
                 +----------+----------+
                 |   Application shell |
                 +----------+----------+
                            |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
   Onboarding MFE      Dashboard MFE       Clients MFE
        |                   |                   |
        v                   v                   v
   Onboarding APIs     Reporting APIs      Client APIs
```

Each vertical slice should align with a business capability, not an arbitrary visual fragment.

Good boundary:

```text
Onboarding team
  -> routes
  -> components
  -> workflow state
  -> API integration
  -> tests
  -> deployment
```

Weak boundary:

```text
Button team
Header team
Table-row team
```

Small visual elements normally belong in a shared design system, not separate deployable applications.

## When Should We Use Micro-Frontends?

Use them when several conditions are true:

- multiple autonomous teams own distinct business domains;
- teams need independent release schedules;
- a frontend monolith has become a delivery bottleneck;
- incremental migration from legacy technology is required;
- different areas have different risk, scaling, or release requirements;
- the organization can support platform engineering and governance.

Avoid them when:

- one small team owns the whole application;
- the application is small or changes as one unit;
- independent deployment is not required;
- boundaries are unclear;
- the organization cannot support duplicated tooling and operational complexity.

Interview answer:

> I choose micro-frontends to solve team-scale and release-independence problems, not merely because the application has many components. For one team or a small product, a modular monolith is usually simpler.

## Modular Monolith Vs Micro-Frontend

```text
Modular monolith
  -> clear feature boundaries
  -> one build and deployment
  -> simpler local development
  -> good default starting point

Micro-frontends
  -> clear business boundaries
  -> separate builds and deployments
  -> stronger team autonomy
  -> higher runtime and operational complexity
```

A modular monolith can be the right first step. Its feature boundaries can later become extraction points if independent deployment becomes valuable.

## Core Building Blocks

### Application Shell

The shell, host, or container owns cross-application concerns:

- top-level layout and navigation;
- route-to-micro-frontend mapping;
- authentication bootstrap;
- error boundaries and loading fallbacks;
- shared dependency policy;
- global telemetry;
- feature flags and runtime configuration.

```jsx
function AppShell() {
  return (
    <AuthProvider>
      <GlobalErrorBoundary>
        <Header />
        <MainRouter />
      </GlobalErrorBoundary>
    </AuthProvider>
  )
}
```

The shell should remain thin. Business rules belong in the owning micro-frontend.

### Micro-Frontend

Each micro-frontend should expose a small public contract:

```ts
export type OnboardingAppProps = {
  clientId: string
  onComplete: (clientId: string) => void
}
```

Consumers should depend on the contract, not internal files.

### Shared Platform

Shared packages can provide:

- design-system components and tokens;
- authentication helpers;
- API clients and generated types;
- logging and telemetry;
- lint, test, and build configuration.

Do not turn `shared` into an unowned collection of business logic. Every package needs an owner, version policy, and compatibility contract.

## Composition Strategies

### 1. Build-Time Composition

Applications consume shared packages through npm or a monorepo:

```tsx
import { DocumentUpload } from "@company/design-system"
import { onboardingRoutes } from "@company/onboarding"
```

Advantages:

- simple runtime;
- strong TypeScript support;
- easy local development and testing.

Trade-off:

- the host must rebuild and redeploy to consume a new application version.

### 2. Runtime Composition With Module Federation

The host loads separately deployed JavaScript containers at runtime.

```text
Host deployment
  |
  +-- loads onboarding/remoteEntry.js
  +-- loads dashboard/remoteEntry.js
  +-- loads clients/remoteEntry.js
```

Remote configuration:

```js
const { ModuleFederationPlugin } = require("webpack").container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "onboarding",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/OnboardingApp",
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
      },
    }),
  ],
}
```

Host configuration:

```js
new ModuleFederationPlugin({
  name: "shell",
  remotes: {
    onboarding: "onboarding@https://cdn.example.com/onboarding/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: false },
    "react-dom": { singleton: true, requiredVersion: false },
  },
})
```

Lazy loading the remote:

```jsx
const OnboardingApp = lazy(() => import("onboarding/App"))

function OnboardingRoute() {
  return (
    <RemoteErrorBoundary name="Onboarding">
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingApp />
      </Suspense>
    </RemoteErrorBoundary>
  )
}
```

Module Federation allows independent builds to expose and consume modules. Shared singleton configuration is commonly used to avoid multiple incompatible React runtimes.

Advantages:

- independent deployment;
- runtime integration;
- shared dependency negotiation;
- incremental migration.

Trade-offs:

- runtime failures and version mismatches;
- more complex caching and rollback;
- remote type distribution needs a strategy;
- local development requires coordination.

### 3. Route-Level Composition

Each route belongs to one application:

```text
/onboarding/* -> Onboarding MFE
/dashboard/*  -> Dashboard MFE
/clients/*    -> Clients MFE
```

This is usually the easiest boundary because ownership, loading, routing, and failure isolation are clear.

### 4. Orchestrator-Based Composition

An orchestrator such as single-spa mounts and unmounts applications according to active routes.

```js
registerApplication({
  name: "onboarding",
  app: () => System.import("@company/onboarding"),
  activeWhen: ["/onboarding"],
})
```

This approach can coordinate applications built with different frameworks, but cross-framework consistency and shared UX require strong governance.

### 5. Web Components

Web Components expose framework-neutral custom elements:

```html
<client-risk-summary client-id="C101"></client-risk-summary>
```

Custom elements and Shadow DOM can provide DOM and style encapsulation. They are useful when several frameworks must consume the same independently packaged UI.

Trade-offs include React-to-custom-element event/property integration, accessibility testing, form participation, and design-token coordination.

### 6. Iframes

Iframes provide the strongest isolation:

```html
<iframe src="https://payments.example.com/checkout"></iframe>
```

They can be appropriate for untrusted, regulated, or independently secured content. Their costs include navigation, responsive sizing, accessibility, communication, and inconsistent UX.

## Choosing A Composition Strategy

```text
Need simple shared code?                 -> npm packages / monorepo
Need independent runtime deployments?    -> Module Federation
Need route-based framework orchestration?-> single-spa style orchestrator
Need framework-neutral embedded widgets? -> Web Components
Need maximum security/process isolation?  -> iframe
```

Interview answer:

> I prefer route-level ownership first because it creates a clean boundary. I use runtime federation only when independent deployment provides real value. Web Components help with framework-neutral widgets, while iframes are reserved for strong isolation.

## Domain Decomposition

Use business capabilities and Domain-Driven Design ideas:

```text
Stablehouse platform
  |
  +-- onboarding
  |     +-- account type
  |     +-- POI / POA
  |     +-- tax information
  |     +-- review
  |
  +-- operations dashboard
  |     +-- workflow queue
  |     +-- client status
  |     +-- reporting
  |
  +-- client administration
        +-- roles
        +-- permissions
        +-- profile
```

Boundary questions:

- Does one team own the capability?
- Can it release independently?
- Does it have a cohesive domain vocabulary?
- Can it fail without taking down the whole application?
- Is communication with other domains small and explicit?

Do not split one workflow so finely that every user action requires synchronous coordination across several micro-frontends.

## Routing Ownership

The shell owns top-level routing; a micro-frontend may own routes inside its prefix.

```text
Shell
  +-- /onboarding/* -> Onboarding router
  |                       +-- /account-type
  |                       +-- /documents
  |                       +-- /review
  |
  +-- /dashboard/*  -> Dashboard router
```

Rules:

- define one owner for browser history;
- avoid multiple routers competing for the same URL;
- preserve deep links and browser back/forward behavior;
- document route contracts;
- use route parameters for shareable navigation state.

## State Management

Classify state before sharing it:

```text
Local component state
  -> useState / useReducer

Domain state inside one MFE
  -> local store owned by that MFE

Server state
  -> TanStack Query / RTK Query / Apollo

Cross-application identity or configuration
  -> shell contract, focused context, or platform service

Shareable navigation state
  -> URL
```

Avoid one global Redux store that every micro-frontend can modify. It creates build-time coupling, action-name collisions, hidden dependencies, and coordinated releases.

If Redux is required, each domain can own its slice and expose a narrow integration API. Dynamic reducer injection is possible, but it should not become a substitute for proper boundaries.

## Communication Between Micro-Frontends

Prefer communication mechanisms in this order:

1. URL and route parameters.
2. Explicit props and callbacks.
3. Shared server state and cache invalidation.
4. Typed events for loose notifications.
5. A shared client store only for truly cross-cutting state.

Props example:

```jsx
<OnboardingApp
  clientId={clientId}
  onComplete={(id) => navigate(`/clients/${id}`)}
/>
```

Event example:

```js
window.dispatchEvent(
  new CustomEvent("onboarding:completed", {
    detail: { clientId },
  })
)
```

```js
useEffect(() => {
  function handleComplete(event) {
    queryClient.invalidateQueries({ queryKey: ["client", event.detail.clientId] })
  }

  window.addEventListener("onboarding:completed", handleComplete)
  return () => window.removeEventListener("onboarding:completed", handleComplete)
}, [queryClient])
```

Events should be namespaced, versioned when necessary, validated, documented, and cleaned up. Do not use a global event bus as an invisible replacement for explicit contracts.

## Shared Dependencies

Duplicate dependencies increase bundle size and can break runtime assumptions.

React usually needs singleton treatment because multiple incompatible copies can cause hook and context problems.

```text
Safe to share cautiously
  -> React / ReactDOM
  -> router integration contract
  -> design-system package

Often fine to bundle per MFE
  -> small utility libraries
  -> domain-specific dependencies
```

Sharing every dependency saves bytes but increases coupling. Bundle independence and caching may be more valuable than eliminating every duplicate kilobyte.

## Design System And CSS Isolation

Use a shared design system for visual consistency:

```text
Design tokens
  +-- colors
  +-- spacing
  +-- typography
  +-- breakpoints

Components
  +-- Button
  +-- Input
  +-- Modal
  +-- DataTable
```

CSS strategies include:

- CSS Modules;
- scoped naming conventions;
- utility CSS with shared configuration;
- CSS-in-JS with a coordinated runtime;
- Shadow DOM for Web Components.

Keep global CSS minimal. Reset styles, fonts, portals, stacking contexts, and theming must have explicit ownership.

## Authentication And Authorization

The shell can bootstrap authentication and expose a narrow session contract:

```ts
type Session = {
  userId: string
  roles: string[]
  getAccessToken: () => Promise<string>
}
```

```text
Identity provider
        |
        v
Application shell establishes session
        |
        +-- Onboarding requests scoped token
        +-- Dashboard requests scoped token
        +-- Clients requests scoped token
```

Security rules:

- backend services enforce authorization;
- do not pass long-lived tokens through URLs or browser events;
- avoid exposing secrets in runtime configuration;
- validate remote origins and use Content Security Policy;
- protect against XSS and CSRF according to the authentication model;
- keep role and permission contracts consistent.

The shell may hide unauthorized routes for UX, but route guards are not the security boundary.

## Independent Deployment

Independent deployment is the architectural payoff:

```text
Onboarding commit
  -> onboarding CI pipeline
  -> unit and contract tests
  -> deploy versioned assets
  -> update runtime manifest
  -> canary release
  -> monitor
```

Use immutable, versioned asset URLs:

```json
{
  "onboarding": "https://cdn.example.com/onboarding/8f31c2/remoteEntry.js",
  "dashboard": "https://cdn.example.com/dashboard/a417bd/remoteEntry.js"
}
```

A runtime manifest separates shell deployment from remote selection and makes rollback a manifest change rather than a rebuild.

Deployment safeguards:

- contract and compatibility tests;
- immutable CDN assets;
- controlled cache headers;
- feature flags and canary releases;
- health checks and synthetic tests;
- rapid rollback to a known remote version.

## Versioning And Contracts

Contracts include more than TypeScript props:

- exposed module names;
- component props and events;
- route shapes;
- shared package versions;
- API schemas;
- design-system behavior;
- telemetry fields.

TypeScript catches compile-time mismatch only when host and remote compile together. Runtime-loaded remotes also need compatibility policies, schema validation, and integration tests.

Use additive changes where possible:

```ts
// Safer evolution: add an optional field.
type ClientSelectedEventV2 = {
  clientId: string
  source?: "dashboard" | "search"
}
```

## Failure Isolation

Every remote can fail independently because of a network error, bad deployment, or incompatible contract.

```jsx
<RemoteErrorBoundary
  name="Dashboard"
  fallback={<DashboardUnavailable />}
>
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardApp />
  </Suspense>
</RemoteErrorBoundary>
```

Plan for:

- remote script timeout;
- chunk-load failure after deployment;
- malformed runtime configuration;
- API failure;
- incompatible shared dependency;
- partial application availability.

The shell should keep navigation and unaffected capabilities usable.

## Performance

Micro-frontends can improve route-level loading but can also create duplicated code, network waterfalls, and excessive runtime initialization.

```text
Shell HTML/JS
   |
   v
Remote manifest
   |
   v
remoteEntry.js
   |
   v
Remote chunks
   |
   v
Remote API data
```

Optimization techniques:

- load remotes only for active routes;
- prefetch likely next routes;
- avoid large shared dependency graphs;
- use immutable caching for versioned assets;
- set performance budgets per micro-frontend;
- measure Core Web Vitals and route transition time;
- prevent duplicate React and design-system runtimes;
- use skeletons to avoid layout shifts.

Measure the complete page, not only each remote bundle. Local optimization can still produce a slow integrated application.

## Testing Strategy

Use a testing pyramid:

```text
              End-to-end tests
          Critical cross-MFE journeys
        -----------------------------
           Integration/contract tests
        Host + remote public contracts
      ---------------------------------
         Component and unit tests
       Each MFE's business behavior
```

Examples:

- unit test onboarding validation;
- component test document upload states;
- contract test exposed module and props;
- integration test shell authentication plus remote mounting;
- end-to-end test account type -> POI -> POA -> review;
- visual regression test shared design-system components.

Avoid duplicating the full end-to-end suite in every repository. Define ownership for cross-domain journeys.

## Observability

All micro-frontends should emit compatible telemetry:

```js
logger.error("remote_load_failed", {
  application: "onboarding",
  version: BUILD_VERSION,
  route: location.pathname,
  correlationId,
})
```

Capture:

- application and version;
- shell version;
- route and user journey step;
- correlation or trace ID;
- remote-loading failures;
- JavaScript and API errors;
- Web Vitals and route performance.

Tools such as Sentry, Datadog, and Application Insights should allow engineers to trace one user journey across shell, remote, and backend calls.

## Local Development

Support three modes:

```text
Standalone remote
  -> fast domain development

Local remote + deployed shell/remotes
  -> realistic integration without running everything

Full local environment
  -> cross-application debugging
```

Runtime manifests or environment overrides can point one remote to localhost while the rest use deployed development versions.

## Repository Strategies

### Monorepo

Advantages:

- atomic refactoring;
- shared tooling;
- easier type and design-system reuse;
- consistent developer experience.

Trade-offs:

- repository and CI complexity;
- accidental source-level coupling;
- ownership rules are still required.

### Polyrepo

Advantages:

- stronger repository boundaries;
- independent permissions and pipelines;
- technology autonomy.

Trade-offs:

- harder cross-repository changes;
- package and contract coordination;
- duplicated tooling.

Repository choice does not define micro-frontends. Independent ownership and deployment can exist in either model.

## Migration Strategy

Use a strangler approach instead of rewriting everything:

```text
Existing frontend monolith
        |
        +-- extract one low-risk route
        |
        +-- introduce shell contract
        |
        +-- establish deployment and observability
        |
        +-- extract next bounded capability
```

Steps:

1. Identify business boundaries and team ownership.
2. Establish shell, navigation, auth, and design-system contracts.
3. Extract one route with low cross-domain coupling.
4. Build independent CI/CD and rollback.
5. Add contract tests and integrated observability.
6. Measure delivery speed, reliability, and performance.
7. Continue only when the architecture produces measurable value.

## Common Anti-Patterns

- splitting by UI widget instead of business capability;
- one shared global store writable by every team;
- importing another remote's internal files;
- sharing every dependency as a singleton;
- deploying independently without compatibility tests;
- allowing every team to invent different UX patterns;
- a shell containing all business logic;
- runtime remotes without loading and error fallbacks;
- global CSS that leaks across applications;
- using events for request-response workflows;
- adopting micro-frontends before organizational need exists.

## Stablehouse Resume-Based Scenario

A credible architecture discussion based on an enterprise onboarding and dashboard platform:

```text
Stablehouse shell
  |
  +-- Auth0 session and RBAC
  +-- navigation and layout
  +-- runtime configuration
  +-- global error monitoring
  |
  +-- Onboarding MFE
  |     +-- account/investor type
  |     +-- POI / POA uploads
  |     +-- tax and liveness steps
  |     +-- review workflow
  |
  +-- Dashboard MFE
  |     +-- client list
  |     +-- workflow status
  |     +-- operational reporting
  |
  +-- Shared design system
        +-- form controls
        +-- document upload
        +-- status components
```

Example interview story:

> We organized the frontend around business capabilities such as onboarding and dashboard workflows. The shell owned navigation, authentication, and common layout, while feature teams owned their domain components, API integration, tests, and release process. Shared design-system components kept the experience consistent. Server state was handled with TanStack Query or RTK Query, while local form state remained inside the owning domain. We minimized cross-application communication and used explicit contracts for navigation and workflow completion.

Only claim runtime Module Federation, independent deployments, or a specific orchestrator if those were actually used. Otherwise present them as architectural options you understand.

## Micro-Frontend Interview Questions And Answers

### 1. What Problem Do Micro-Frontends Solve?

They primarily solve organizational scaling and independent delivery. They allow teams aligned to business capabilities to release without coordinating one large frontend deployment.

### 2. Are Micro-Frontends Just Components?

No. Components are code-reuse units. A micro-frontend is an ownership and deployment boundary with its own lifecycle, tests, contracts, and operational responsibility.

### 3. How Do You Choose Boundaries?

I use business capabilities, team ownership, domain vocabulary, route ownership, data ownership, and release cadence. I avoid splitting tightly coupled steps across separate applications.

### 4. What Does The Shell Own?

Top-level routing, navigation, layout, authentication bootstrap, remote loading, global fallbacks, runtime configuration, and common telemetry. It should not own domain business logic.

### 5. What Is Module Federation?

Module Federation allows separately built applications to expose and consume JavaScript modules at runtime. A host can load a remote application without compiling its source into the host build.

### 6. Why Share React As A Singleton?

React hooks and context assume compatible runtime identity. Loading multiple incompatible React copies can increase bundle size and cause invalid hook or context behavior.

### 7. Module Federation Vs npm Package?

An npm package is integrated at build time and requires the consumer to rebuild for an update. A federated remote can be selected at runtime and deployed independently, but adds runtime failure and compatibility concerns.

### 8. How Do Micro-Frontends Communicate?

I prefer URL state and explicit props/callbacks. For loose notifications I use typed, namespaced events. I avoid direct imports of remote internals and a large shared mutable store.

### 9. How Do You Share State?

Most state stays within its domain. Server state is fetched by the owning micro-frontend. Only stable cross-cutting information such as session identity, locale, or feature flags is shared through a narrow platform contract.

### 10. Can Micro-Frontends Share Redux?

They can, but one global writable store creates coupling. I prefer domain-owned stores. If a shared store is unavoidable, ownership, reducer injection, action contracts, and compatibility must be explicit.

### 11. How Do You Handle Routing?

The shell owns top-level routes and delegates a route prefix to each micro-frontend. There should be one owner of browser history, reliable deep links, and documented route contracts.

### 12. How Do You Maintain Consistent UI?

Use a versioned design system, shared tokens, accessibility standards, visual regression tests, and governance. Teams should share primitives while retaining domain ownership.

### 13. How Do You Avoid CSS Conflicts?

Keep global CSS minimal and use CSS Modules, scoped naming, coordinated utility configuration, or Shadow DOM where appropriate. Define ownership for resets, portals, themes, and stacking layers.

### 14. How Do You Handle Authentication?

The shell establishes the session and exposes a narrow way to obtain identity and scoped access tokens. Each backend still enforces authorization. Tokens should not be broadcast through URLs or global events.

### 15. How Do You Secure Remote Loading?

Load remotes only from approved origins, use HTTPS and Content Security Policy, secure the deployment pipeline and runtime manifest, avoid secrets in frontend configuration, and monitor unexpected version changes.

### 16. What Happens If A Remote Fails?

The shell catches loading and rendering failures with timeout, Suspense, and error-boundary fallbacks. Navigation and unrelated domains remain usable, and telemetry identifies the remote version that failed.

### 17. How Do You Deploy Independently?

Each domain has its own pipeline and publishes immutable versioned assets. A runtime manifest selects compatible versions. Canary releases, contract tests, monitoring, and manifest rollback reduce risk.

### 18. How Do You Test Micro-Frontends?

Each domain owns unit and component tests. Host and remote contracts get integration tests. A smaller end-to-end suite verifies critical journeys across domains, and visual tests protect the design system.

### 19. How Do You Monitor Them?

Logs and errors include shell version, remote name/version, route, and correlation ID. Centralized monitoring connects client errors, performance metrics, and backend traces for one user journey.

### 20. What Are The Main Performance Risks?

Duplicate dependencies, remote-loading waterfalls, too many entry points, cache mistakes, and each team optimizing only its own bundle. I measure the integrated page and apply budgets to shell and remotes.

### 21. Monorepo Or Multiple Repositories?

Either can work. A monorepo simplifies shared tooling and atomic changes; polyrepos strengthen isolation. Ownership, contracts, and deployment independence matter more than repository count.

### 22. Can Different Frameworks Be Used?

Yes, through route orchestration, Web Components, or isolated mounting contracts. I allow it only when migration or organizational value outweighs larger bundles and inconsistent developer and user experiences.

### 23. How Would You Migrate A Monolith?

I use a strangler approach: define boundaries, establish shell contracts, extract one low-risk route, add independent delivery and monitoring, measure results, and migrate incrementally.

### 24. What Is The Biggest Micro-Frontend Mistake?

Treating it as a purely technical bundle-splitting exercise. Without autonomous teams, stable domain boundaries, and independent delivery, the system receives the complexity without the main benefit.

### 25. When Would You Reject Micro-Frontends?

I would reject them for a small application owned by one team, unclear domain boundaries, or an organization without the platform maturity to support contracts, deployment, observability, and governance.

## Senior-Level Interview Summary

> Micro-frontends are an organizational architecture expressed in frontend technology. I start with business boundaries and team ownership, choose the simplest composition model that supports independent delivery, and keep contracts explicit. The shell owns platform concerns, domains own their state and business behavior, and shared code is governed rather than accidental. I design for remote failure, compatibility, security, observability, and rollback from the beginning. If those costs do not create measurable delivery value, I prefer a modular frontend monolith.

## Quick Revision Checklist

- Business capability boundaries, not arbitrary UI fragments.
- Thin shell; domain logic stays in the owning micro-frontend.
- Route-level decomposition is usually the simplest starting point.
- Runtime federation enables independent deployment but adds runtime risk.
- Keep state local and communication explicit.
- Share React carefully; do not share every dependency automatically.
- Use a governed design system and scoped CSS.
- Backend authorization remains mandatory.
- Versioned assets, runtime manifests, canaries, and rollback support releases.
- Test contracts and critical cross-domain journeys.
- Monitor shell and remote versions together.
- Prefer a modular monolith when the organizational need is absent.

## References

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [single-spa micro-frontend concepts](https://single-spa.js.org/docs/microfrontends-concept/)
- [single-spa recommended setup](https://single-spa.js.org/docs/recommended-setup/)
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [MDN Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
