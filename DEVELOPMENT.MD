# Development Guide

## TypeScript Setup

This project uses **TypeScript** to provide type safety and better developer experience. All source files are located in the `src/` directory and compiled to the root directory.

### Project Structure

```
src/
├── types.ts       # Shared type definitions
├── popup.ts       # Popup UI script
├── background.ts  # Service worker (background script)
└── content.ts     # Content script for page interaction
```

### Build Setup

- **Compiler**: TypeScript (`tsc`)
- **Configuration**: [tsconfig.json](tsconfig.json)
- **Source Directory**: `src/`
- **Output Directory**: Root (`.`)
- **Source Maps**: Enabled for debugging

### Available Scripts

```bash
npm run build      # Compile TypeScript to JavaScript
npm run watch      # Watch mode - auto-recompile on file changes
npm run clean      # Remove compiled .js and .js.map files
npm run rebuild    # Clean and rebuild
```

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development with watch mode:
   ```bash
   npm run watch
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Type Definitions

Shared types are defined in [src/types.ts](src/types.ts):
- `StoredLink` — Link object with url and title
- `Link` — Union type for backward compatibility
- `LinksStorage` — Storage structure
- Message request/response types

All scripts import and use these types for type safety across the extension.
