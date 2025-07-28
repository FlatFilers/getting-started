# Flatfile Coding Tutorial - Adding Actions (TypeScript)

This is part of the [Flatfile Coding Tutorial](https://flatfile.com/docs/coding-tutorial/101-your-first-listener/101.03-adding-actions) demonstrating how to add custom actions to your Flatfile listener.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Flatfile credentials

3. Run the development server:
   ```bash
   npx flatfile develop
   ```

The listener will connect to your Flatfile workspace and register the custom actions defined in `index.ts`.
