# React Tooling And Webpack Interview Notes

Purpose: quick interview revision with simple examples and visual mental models.

## Why Tooling Matters

React code must be transformed, bundled, optimized, tested, and deployed.

```text
Source code
  |
  v
Bundler/transpiler
  |
  v
Optimized assets
  |
  v
Browser
```

Interview answer:

Tooling converts developer-friendly code into production-ready JavaScript, CSS, and assets.

## Webpack Purpose

Webpack is a module bundler.

It starts from an entry file, follows imports, builds a dependency graph, and outputs bundles.

```text
main.jsx
  |
  +-- App.jsx
  +-- styles.css
  +-- image.png
  +-- utils.js
  |
  v
bundle.js
```

Interview answer:

Webpack bundles JavaScript, CSS, images, and other assets so the browser can load the application efficiently.

## Dependency Graph

A dependency graph is the map of imports in the app.

```jsx
import App from "./App"
import "./styles.css"
```

```text
main.jsx
  |
  +-- App.jsx
      |
      +-- Header.jsx
      +-- Dashboard.jsx
```

Interview answer:

Webpack builds a dependency graph by following imports from the entry file. Bundling, tree shaking, and code splitting depend on this graph.

## Simple Webpack Config

```js
const path = require("path")

module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
}
```

Interview answer:

Webpack config defines the entry point, output bundle, loaders, plugins, and optimization rules.

## Loaders

Loaders transform files before bundling.

Examples:

```text
babel-loader -> converts modern JS/JSX
css-loader   -> handles CSS imports
file-loader  -> handles assets
```

Interview answer:

Loaders let Webpack understand file types that browsers cannot directly import as JavaScript modules.

## Plugins

Plugins perform broader build tasks.

Examples:

```text
HtmlWebpackPlugin       -> generates HTML
MiniCssExtractPlugin    -> extracts CSS
DefinePlugin            -> injects constants
```

Interview answer:

Loaders transform individual files. Plugins handle broader bundle/build operations.

## Tree Shaking

Tree shaking removes unused code from the final bundle.

Example:

```js
// utils.js
export function used() {}
export function unused() {}
```

```js
import { used } from "./utils"

used()
```

Bundler can remove `unused` if it is safe.

Mental model:

```text
Source exports
  |
  v
Analyze imports
  |
  v
Keep used code
  |
  v
Remove unused code
```

Interview answer:

Tree shaking works best with ES modules because imports and exports are statically analyzable.

## Code Splitting

Code splitting breaks the app into smaller chunks.

```jsx
import { lazy, Suspense } from "react"

const ReportsPage = lazy(() => import("./ReportsPage"))

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ReportsPage />
    </Suspense>
  )
}
```

Interview answer:

Code splitting reduces initial bundle size by loading heavy routes or components only when needed.

## Vite

Vite is a modern frontend build tool.

```text
Development
  |
  +-- fast dev server
  +-- native ES modules

Production
  |
  +-- optimized build
  +-- bundling/minification
```

Interview answer:

Vite gives faster local development and optimized production builds. It is commonly used for modern React apps.

## Babel

Babel transforms modern JavaScript/JSX into browser-compatible JavaScript.

```text
JSX
  |
  v
Babel transform
  |
  v
JavaScript
```

Interview answer:

Babel is used to compile JSX and modern JavaScript features based on browser support.

## Old Browser Support

React applications support older browsers through build configuration, transpilation, and polyfills.

Important React version point:

```text
React 17 -> can support Internet Explorer with proper polyfills
React 18+ -> does not support Internet Explorer
```

Modern React apps usually target modern browsers:

```text
Chrome
Edge
Firefox
Safari
Mobile browsers
```

How old browser support works:

```text
Developer writes React code
        |
        v
Modern JS / JSX / CSS
        |
        v
Build tool: Vite or Webpack
        |
        v
Babel / SWC transpiles syntax
        |
        v
Polyfills add missing features
        |
        v
Final JS bundle
        |
        v
Runs in supported browsers
```

Transpilation means converting newer syntax into older JavaScript syntax.

Example modern syntax:

```js
const name = user?.profile?.name
```

Older-compatible output may look like:

```js
const name =
  user == null
    ? undefined
    : user.profile == null
      ? undefined
      : user.profile.name
```

Polyfills add missing browser features.

Examples:

```text
Promise
fetch
Array.from
Object.assign
```

Difference:

```text
Transpilation -> changes new syntax into older syntax
Polyfill      -> adds missing browser APIs/features
```

Browser support is commonly configured with `browserslist`.

Example:

```json
{
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

Vite example:

```js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2015",
  },
})
```

Webpack/Babel example:

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
  ],
}
```

Polyfills can be imported once in the app entry file:

```js
import "core-js/stable"
import "regenerator-runtime/runtime"
```

Interview answer:

React apps support older browsers through build tools and polyfills. Babel or SWC transpiles modern JavaScript syntax into older-compatible JavaScript, while polyfills add missing runtime features like `Promise`, `fetch`, or `Object.assign`. Browser targets are usually configured through `browserslist`. However, React 18 and newer do not support Internet Explorer, so if IE support is required, the project would need React 17 or an older compatible setup.

Quick memory trick:

```text
New syntax problem -> Babel/SWC
Missing feature problem -> Polyfill
Unsupported React version -> Cannot fully fix with config
```

## ESLint

ESLint finds code quality problems.

Examples:

- unused variables
- missing hook dependencies
- invalid hook usage
- inconsistent patterns

Interview answer:

ESLint helps catch mistakes early and maintain consistent code quality.

## Prettier

Prettier formats code automatically.

Interview answer:

Prettier reduces style debates by enforcing consistent formatting.

## npm Scripts

Example:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

Interview answer:

Scripts standardize common project commands for development, build, linting, and preview.

## Bundle Analysis

Bundle analysis helps find large dependencies and optimization opportunities.

```text
Bundle
  |
  +-- React
  +-- chart library
  +-- date library
  +-- app code
```

Interview answer:

I use bundle analysis to identify oversized dependencies, duplicate packages, and missing code splitting.

## Environment Variables

Vite exposes only variables prefixed with `VITE_`.

```env
VITE_API_URL=https://api.example.com
```

Usage:

```js
const apiUrl = import.meta.env.VITE_API_URL
```

Important:

Frontend env variables are visible in the browser bundle. Do not store secrets.

## CI/CD

Typical pipeline:

```text
Install dependencies
  |
  v
Run lint
  |
  v
Run tests
  |
  v
Build app
  |
  v
Deploy artifacts
```

Interview answer:

CI/CD automates quality checks and deployments so releases are repeatable and safer.

## Resume-Based Examples

HNB Digital Lobby:

- Jenkins CI/CD automated build/test/deploy workflows.
- lazy loading reduced initial load.
- React Profiler helped performance tuning.

Interview answer:

In HNB Digital Lobby, build and deployment pipelines helped make releases more reliable, while lazy loading and profiling improved performance.

## Quick Interview Summary

- Webpack bundles modules.
- Dependency graph is built from imports.
- Loaders transform files.
- Plugins handle build-level tasks.
- Tree shaking removes unused code.
- Code splitting reduces initial bundle size.
- Vite improves developer experience.
- CI/CD automates lint, test, build, and deploy.
