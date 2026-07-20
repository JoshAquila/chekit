# Contributing

Thanks for helping improve ChekIt.

## Good Contributions

- Fix unclear or incorrect ingredient descriptions.
- Add well-known ingredient synonyms.
- Improve matching behavior without adding private data or secrets.
- Improve docs, local setup, and API examples.

## Data Guidelines

- Edit `data/ingredients.json` for public ingredient data changes.
- Keep descriptions factual, plain-language, and useful to acne-prone skincare users.
- Do not add medical diagnosis claims.
- Do not add private customer data, staging data, API logs, user data, or secrets.
- Include context in the pull request for data changes. If you used a source, name it.

## Local Setup

```bash
npm install
npm run import-data
npm run smoke
npm run dev
```

## Pull Requests

- Keep PRs focused.
- Explain what changed and why.
- Run `npm run smoke` before opening a PR.
- Maintainers may edit wording for clarity, safety, or consistency.
