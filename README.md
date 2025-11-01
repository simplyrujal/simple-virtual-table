# Simple Virtual Table Monorepo

A pnpm workspace monorepo containing separate packages for React and Svelte with corresponding test applications.

## Structure

```
├── apps/
│   ├── react-app/          # React test application
│   └── svelte-app/         # Svelte test application
├── packages/
│   ├── react-virtual/      # React package
│   └── svelte-virtual/     # Svelte package
└── pnpm-workspace.yaml     # Workspace configuration
```

## Packages

### @simple-virtual-table/react-virtual

A React package containing reusable components.

**Location:** `packages/react-virtual/`

**Components:**

- `HelloWorld` - A simple greeting component

### @simple-virtual-table/svelte-virtual

A Svelte package containing reusable components.

**Location:** `packages/svelte-virtual/`

**Components:**

- `HelloWorld` - A simple greeting component

## Getting Started

### Installation

```bash
pnpm install
```

### Running Applications

**React App:**

```bash
pnpm --filter react-app dev
# or
pnpm start:react-app
```

**Svelte App:**

```bash
pnpm --filter svelte-app dev
# or
pnpm start:svelte-app
```

**Both Apps:**

```bash
pnpm start
```

### Building Packages

Both packages can be built using Vite for production-ready libraries with TypeScript declarations:

**Build all packages:**
```bash
pnpm run build:packages
```

**Build individual packages:**
```bash
pnpm run build:react-virtual
pnpm run build:svelte-virtual
```

**Build everything (packages + apps):**
```bash
pnpm run build:all
```

### Development

The packages are configured to work directly with Vite's bundler. Both React and Svelte packages can be used directly from source during development, and built for production with full TypeScript support.

## How It Works

1. **Workspace Configuration**: The `pnpm-workspace.yaml` defines the workspace structure
2. **Package Configuration**: Each package exports its source files directly (lib/index.ts)
3. **App Integration**: Apps import from packages using `workspace:*` protocol
4. **TypeScript**: Source files are written in TypeScript and transpiled by Vite

## Testing the Packages

Both test applications import and use the `HelloWorld` component from their respective packages:

- **React App**: Displays `HelloWorld` with name="React"
- **Svelte App**: Displays `HelloWorld` with name="Svelte"

## Package Manager

This project uses **pnpm** with workspace protocol (`workspace:*`) to link packages within the monorepo.
