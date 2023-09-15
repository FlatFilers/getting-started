# Getting Started

If you're just getting started with Flatfile, you're in the right place.

This code supports [Flatfile's Beginner Tutorial](https://flatfile.com/docs/quickstart), a four-step walkthrough that helps you create your first data import experience.

1. Configure your data destination: Meet the Workbook
2. Import and extract your data: Setup a listener
3. Process your data: Transform and validate data
4. Export your data: Configure a submit Action

## Setup your environment variables

Before you begin, set up your environment variables. Rename `.env.example` to `.env` and update it with your credentials.

Your `.env` file should look similar to this:

```
FLATFILE_ENVIRONMENT_ID=us_env_1234
FLATFILE_API_KEY=sk_1234
WEBHOOK_SITE_URL=https://webhook.site/1234
```

## Stepping through the tutorial

After you set up your environment variables, the first step of the tutorial, creating your first Workbook, can be done by running `npm run create-workbook`.

The remainder of the tutorial can be stepped through in either typescript or javascript.

If using javascript, run `npx flatfile develop javascript/index.js` to start a local listener.

If using typescript, run `npx flatfile develop typescript/index.ts` to start a local listener.

Guidance and context for these steps can be found in our [Beginner Tutorial Documentation](https://flatfile.com/docs/quickstart).

## See all code examples

To see all of the code examples from the docs, head to the [flatfile-docs-kitchen-sink](https://github.com/FlatFilers/flatfile-docs-kitchen-sink) repo.
