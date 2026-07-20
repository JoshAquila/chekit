# Security

## Reporting

Please report security issues privately to the maintainers instead of opening a public issue.

If you do not have a private contact for the maintainers, open a public issue that says only that you need to report a security issue. Do not include exploit details, credentials, or private data in the issue.

## Secrets

This repository must not contain:

- `.env` files
- Postgres URLs
- API keys
- user data
- API logs
- staging or production dumps

Use `.env.example` for documentation only.

## Supported Data

The public ingredient data lives in `data/ingredients.json`. Generated SQLite files are ignored and should be rebuilt locally with:

```bash
npm run import-data
```
