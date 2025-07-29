# 102.01 Adding Plugins - TypeScript

This example demonstrates how to refactor manual Event handling to use Flatfile Plugins for cleaner, more maintainable code.

## What's Different from 101.03

This code accomplishes the same functionality as [101.03 Adding Actions](../../../101.03-adding-actions) but with significantly less code by using:

- **SpaceConfigure Plugin**: Eliminates manual Space setup boilerplate
- **JobHandler Plugin**: Provides automatic Job lifecycle management with progress tracking
- **RecordHook Plugin**: Simplifies Record processing with batch operations

## Key Features

- **60% less code** compared to manual Event handling
- **Automatic error handling** built into Plugins
- **Built-in progress tracking** with the `tick` function
- **Batch Record processing** for better performance


## Installation

```bash
npm install
```

## Usage

This Listener code is designed to be deployed to Flatfile. Follow the [deployment guide](https://flatfile.com/docs/guides/deploying) to get started.

## Code Walkthrough

### 1. Space Configuration
The `configureSpace` Plugin automatically handles the `space:configure` Event and sets up your Workbook structure:

```typescript
listener.use(configureSpace({
  workbooks: [{ /* workbook configuration */ }]
}))
```

### 2. Record Validation
The `bulkRecordHook` Plugin processes Records in batches for better performance:

```typescript
listener.use(bulkRecordHook('contacts', (records) => {
  // Process records in batch with TypeScript types
}))
```

### 3. Action Handling
The `jobHandler` Plugin manages Job lifecycle automatically:

```typescript
listener.use(jobHandler('workbook:submitActionForeground', async (event, tick) => {
  // Business logic with automatic progress tracking
}))
```

## Learn More

- [Listeners 102: Using Plugins](https://flatfile.com/docs/coding-tutorial/102-modularity-and-depth/102.01-using-plugins)
- [SpaceConfigure Plugin](https://flatfile.com/docs/plugins/space-configure)
- [JobHandler Plugin](https://flatfile.com/docs/plugins/job-handler)
- [RecordHook Plugin](https://flatfile.com/docs/plugins/record-hook)
