# React Interview Lab

React Interview Lab is an interactive React and TypeScript learning workspace for frontend interview preparation. It combines runnable examples, detailed revision notes, practical scenarios, mental models, and interview-focused explanations in one project.

## Key Features

- Runnable examples for common React concepts and interview questions
- Topic-based navigation with protected routes
- Detailed Markdown notes for quick revision
- React hooks, performance, architecture, security, and testing examples
- React 19 concepts and modern frontend patterns
- Auth0 authentication for the learning dashboard
- Redux Toolkit and typed React-Redux hooks
- Tailwind CSS and reusable UI-pattern demonstrations
- Responsive layout for desktop and mobile study sessions

## Covered Topics

- React fundamentals, components, props, state, events, and rendering
- Hooks, custom hooks, stale closures, effects, refs, and memoization
- Routing, protected routes, URL state, loaders, and nested layouts
- Forms, validation, controlled inputs, and multi-step workflows
- State management with Context API and Redux Toolkit
- TanStack Query, API calls, race conditions, polling, and optimistic UI
- Performance profiling, code splitting, virtualization, and Web Vitals
- TypeScript types, generics, narrowing, guards, and API contracts
- Authentication, authorization, CSRF, XSS, and browser storage
- Testing, error boundaries, deployment, and frontend architecture
- Micro-frontends, SSR, CSR, SSG, ISR, hydration, and React Server Components

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| Build tooling | Vite |
| Routing | React Router |
| State management | Redux Toolkit, React Context |
| Authentication | Auth0 |
| Styling | CSS, Tailwind CSS |
| Data grids | AG Grid |
| Code quality | ESLint |

## Project Structure

```text
react-interview-lab/
|-- Interview/                 # Long-form interview revision guides
|-- public/                    # Static assets
|-- src/
|   |-- auth/                  # Auth0 configuration
|   |-- interview-topics/      # Runnable examples and topic notes
|   |-- store/                 # Redux Toolkit setup and typed hooks
|   |-- tailwind-lab/          # Tailwind CSS examples
|   |-- App.tsx                # Routes and application shell
|   `-- main.tsx               # Application entry point
|-- README.md
|-- package.json
`-- vite.config.js
```

Each folder under `src/interview-topics` generally contains a runnable React example and a matching Markdown explanation.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- An Auth0 application for authenticated dashboard access

### Installation

```bash
git clone https://github.com/karteekkesav/react-interview-lab.git
cd react-interview-lab
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```text
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

Keep real credentials out of source control. `.env` and local environment files are ignored by Git.

### Start Development

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

## Validation

Before submitting changes, run:

```bash
npm run lint
npm run build
```

## Learning Approach

Choose a topic from the sidebar, run or interact with its example, and then review the accompanying explanation. The root `Interview` directory contains broader interview guides for deeper revision and scenario-based answers.

## Repository

GitHub: [karteekkesav/react-interview-lab](https://github.com/karteekkesav/react-interview-lab)
