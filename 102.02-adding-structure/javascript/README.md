# 102.02 Adding Structure - JavaScript

This example demonstrates how to organize Listener code for maintainability and collaboration by separating configuration from behavior.

## What's Different from 102.01

This code accomplishes the same functionality as [102.01 Using Plugins](../../../102.01-adding-plugins) but with better organization by using:

- **blueprints/ directory**: Contains configuration objects (Workbooks, Sheets, Actions)
- **listeners/ directory**: Contains behavior functions (Plugins and handlers)
- **Modular file structure**: Each component has its own file with clear naming conventions

## Project Structure

```
├── blueprints/
│   ├── workbooks/
│   │   └── people.workbook.js
│   ├── sheets/
│   │   └── people.sheet.js
│   └── actions/
│       └── submit.action.js
├── listeners/
│   ├── configure-space.listener.js
│   ├── people-hook.listener.js
│   └── submit-handler.listener.js
└── index.js
```

## Key Benefits

- **Clear separation** between "what your Space looks like" (blueprints) and "how your Space behaves" (listeners)
- **Easy to navigate** - find exactly what you need quickly
- **Team-friendly** - multiple developers can work on different parts without conflicts
- **Scalable** - add new features without cluttering existing code

## Installation

```bash
npm install
```

## Usage

This Listener code is designed to be deployed to Flatfile. Follow the [deployment guide](https://flatfile.com/docs/guides/deploying) to get started.

## Code Organization

### blueprints/

Contains configuration objects that define what your Space looks like:

- **workbooks/**: Workbook definitions with `.workbook.js` extension
- **sheets/**: Sheet configurations with `.sheet.js` extension
- **actions/**: Action definitions with `.action.js` extension

### listeners/

Contains behavior functions that define how your Space behaves:

- **Listener files**: Named with `.listener.js` extension
- **Plugin configurations**: SpaceConfigure, RecordHook, JobHandler
- **Business logic**: Validation, processing, API calls

### Naming Conventions

- Configuration files: `name.type.js` (e.g., `people.sheet.js`)
- Listener files: `descriptive-name.listener.js` (e.g., `people-hook.listener.js`)
- Clear, descriptive names that indicate purpose

## Learn More

- [Listeners 102: Adding Structure](https://flatfile.com/docs/coding-tutorial/102-modularity-and-depth/102.02-adding-structure)
- [Code Organization Best Practices](https://flatfile.com/docs/guides/code-organization)
