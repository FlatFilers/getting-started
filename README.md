# Guide Listeners Code

This repository contains example code for Flatfile listeners with both TypeScript and JavaScript versions.

## Structure

Each example is organized in folders like `101.01-first-listener/` with:

- `typescript/` - Contains the TypeScript source code
- `javascript/` - Contains the generated JavaScript code (auto-generated)

## Tutorial Structure

This repository follows the Flatfile Developer Documentation tutorial structure:

- `101.01-first-listener/` - Basic space configuration and workbook setup
- `101.02-adding-validation/` - Adding email validation to records  
- `101.03-adding-actions/` - Adding submit actions and data processing

## Scripts

### Generate JavaScript from TypeScript

Use the `scripts/generate-js.ts` script to automatically generate JavaScript versions from TypeScript code:

```bash
# Generate JavaScript for all projects (only if files have changed)
bun scripts/generate-js.ts

# Force regenerate all JavaScript files
bun scripts/generate-js.ts --force

# Generate JavaScript for a specific project
bun scripts/generate-js.ts 101.01-first-listener

# Show help
bun scripts/generate-js.ts --help
```

The script will:

1. Find all folders containing a `typescript/` subdirectory
2. Compile TypeScript files to JavaScript (excluding `node_modules`)
3. Copy `package.json`, `package-lock.json`, and `.env.example` to the JavaScript folder
4. Format the generated JavaScript files (if biome is available)
5. Only recompile files that are newer than their JavaScript counterparts (unless `--force` is used)

## Requirements

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- TypeScript projects should have their dependencies installed in their respective `typescript/` folders
