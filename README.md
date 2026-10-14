# HTML, CSS & Tailwind CSS Interview Lab

An interactive frontend styling lab for learning and revising HTML, CSS, and Tailwind CSS interview concepts. The project uses React and TypeScript as the application shell, while the learning content focuses on semantic markup, layout, responsive design, reusable UI patterns, and Tailwind CSS v4.

## What This Project Covers

- Semantic HTML and accessible element structure
- CSS spacing, sizing, typography, colors, borders, and visual states
- Flexbox and Grid layout decisions
- Mobile-first responsive design
- Hover, focus, active, disabled, loading, and error states
- Accessible forms, labels, inputs, and validation feedback
- Tailwind CSS utility-first styling
- Reusable buttons, badges, cards, forms, and dashboard patterns
- Conditional utility classes and component variants
- Dark mode, transitions, and small UI animations
- Tailwind theme customization and design tokens
- Interview answers, mental models, code samples, and practical scenarios

## Tailwind Lab Topics

The interactive Tailwind lab currently includes:

1. Utility-first styling
2. Spacing and layout
3. Responsive design
4. States and accessibility
5. Forms
6. Reusable components
7. Dark mode
8. Tables and dashboards
9. Transitions and animation
10. Theme customization
11. Tailwind best practices

It also contains a responsive POI/POA review dashboard example with metric cards, filters, status badges, tables, and practical interview explanations.

## Mental Model

```text
Semantic HTML / JSX
        |
        v
Tailwind utility classes
        |
        v
Generated CSS for used classes
        |
        v
Responsive and accessible browser UI
```

Tailwind changes how CSS is authored, not how the browser works. Utilities ultimately generate CSS rules that style normal HTML elements.

## Technology Stack

### Primary learning topics

- HTML5
- CSS3
- Tailwind CSS v4

### Application shell

- React 19
- TypeScript
- Vite
- React Router
- Auth0

React provides the interactive examples and navigation; it is not the main subject of this repository.

## Project Structure

```text
src/
|-- tailwind-lab/
|   `-- TailwindLab.tsx       # Interactive Tailwind lessons and UI examples
|-- index.css                 # Tailwind import and global CSS
|-- App.css                   # Application shell and responsive layout styles
|-- App.tsx                   # Navigation, routes, and authenticated layout
`-- main.tsx                  # Application entry point

Interview/
`-- Tailwind-css-interview.md # Detailed interview guide and examples
```

Additional example folders remain available as supporting frontend references, but the repository's primary learning focus is HTML, CSS, and Tailwind CSS.

## Tailwind CSS v4 Setup

Tailwind is integrated through the official Vite plugin:

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

The global stylesheet loads Tailwind with:

```css
@import "tailwindcss";
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- An Auth0 application for protected dashboard access

### Installation

```bash
git clone https://github.com/karteekkesav/react-interview-lab.git
cd react-interview-lab
npm install
```

Create `.env.local` in the project root:

```text
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

Then start the development server:

```bash
npm run dev
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Validation

```bash
npm run lint
npm run build
```

## Interview Revision Strategy

For each topic:

1. Understand the underlying HTML and CSS behavior.
2. Review the equivalent Tailwind utility classes.
3. Run the visual example and test responsive states.
4. Practice the short interview answer.
5. Explain when custom CSS, reusable components, or a specialized library would be more appropriate.
