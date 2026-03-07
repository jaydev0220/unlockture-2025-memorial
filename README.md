# Unlockture 2025 Memorial

A modern, interactive full-screen scrolling experience built with Vue 3 and TypeScript. This project showcases a custom scroll hijacking mechanism with smooth fullscreen transitions and multi-section navigation.

> This is created to commemorate HACHI's 2025 live tour Unlockture. Also my first concert experience.

## Features

- **Custom Scroll Handling**: Smooth fullscreen section transitions with wheel, keyboard, and touch support
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Sass 1.97](https://sass-lang.com/)
- **Linting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **Package Manager**: [pnpm 10](https://pnpm.io/)

## Getting Started

### Prerequisites

- Node.js: `>=24`
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies with pnpm
pnpm install

# Or with npm
npm install
```

### Development

Start the development server:

```bash
pnpm dev
# or
npm dev
```

### Build

Create a production-optimized build:

```bash
pnpm build
# or
npm build
```

### Preview

Preview the production build locally:

```bash
pnpm preview
# or
npm preview
```

## Code Quality

### Linting

Run all linters (oxlint + ESLint):

```bash
pnpm lint
# or
npm run lint
```

Individual linters:

```bash
# Oxlint
pnpm lint:oxlint

# ESLint
pnpm lint:eslint
```

### Type Checking

Check TypeScript types without building:

```bash
pnpm type-check
# or
npm run type-check
```

### Formatting

Format code with Prettier:

```bash
pnpm format
# or
npm run format
```

## Scroll Behavior

The application intercepts standard scroll events and creates smooth fullscreen transitions between sections:

- **Wheel Events**: Desktop mouse wheel scrolling
- **Keyboard Navigation**: Arrow keys and Page Up/Down
- **Touch Gestures**: Mobile swipe navigation
- **Smooth Transitions**: CSS-based transitions with cubic-bezier easing

The scroll is handled through a hidden proxy element that tracks user input while the main content transforms smoothly between sections.

## Available Scripts

| Script             | Purpose                     |
| ------------------ | --------------------------- |
| `pnpm dev`         | Start development server    |
| `pnpm build`       | Build for production        |
| `pnpm preview`     | Preview production build    |
| `pnpm build-only`  | Vite build only             |
| `pnpm type-check`  | Run Vue TypeScript compiler |
| `pnpm lint`        | Run all linters             |
| `pnpm lint:oxlint` | Run Oxlint                  |
| `pnpm lint:eslint` | Run ESLint                  |
| `pnpm format`      | Format code with Prettier   |

## License

This project is open-source and available under the MIT License.
