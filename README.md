# Vitan Commerce

Client-approved public portfolio repository for a production-oriented commerce catalog built with Next.js. The project demonstrates a custom storefront experience, wishlist/cart flows, order submission, and lightweight admin tooling while keeping production credentials and customer-specific operational data outside the repository.

## Overview

Vitan Commerce is a responsive product catalog for a small business. It is designed around quick product discovery, mobile-first shopping flows, and simple content operations through Contentful.

Core flows:

- Product catalog with search, categories, sorting, image galleries, and detail modals.
- Wishlist and cart stored client-side for a smooth return experience.
- Checkout form that sends structured order notifications through Telegram.
- Wholesale pricing support with retail/wholesale price previews.
- Admin-protected product creation, editing, deletion, and pricing settings.
- Local fixture mode for portfolio review without access to the client's CMS.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Contentful Delivery and Management APIs
- Telegram Bot API for order notifications
- Node test runner for domain logic tests
- pnpm as the package manager

## Repository Safety

This repository is intended to be public. It should contain source code, tests, demo fixtures, and public assets only.

Not committed:

- `.env*` files with real environment values
- Contentful access tokens or management tokens
- Telegram bot token or chat id
- Admin session secret or production admin password
- Customer order exports or private business data
- Local IDE and agent configuration such as `.idea/` and `.ai/mcp/`
- `package-lock.json`, because this project uses `pnpm-lock.yaml`

The demo fixture in `contentful-test-configs.json` contains placeholder catalog data and is safe to use for local preview.

## Environment Variables

Create a local `.env.local` for real integrations. Do not commit it.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | Production | Contentful space id for published content |
| `CONTENTFUL_ACCESS_TOKEN` | Production | Contentful Delivery API token |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Admin features | Contentful Management API token for mutations |
| `CONTENTFUL_ENVIRONMENT` | Optional | Contentful environment, defaults to `master` |
| `ADMIN_SESSION_SECRET` | Production admin | Extra signing secret for admin sessions |
| `TELEGRAM_BOT_TOKEN` | Checkout notifications | Telegram bot token used server-side only |
| `TELEGRAM_CHAT_ID` | Checkout notifications | Telegram chat/channel id for orders |
| `NEXT_PUBLIC_SITE_URL` | Optional | Public site URL used in generated order links |
| `CONTENTFUL_CACHE_ENABLED` | Optional | Set to `true` to enable Contentful cache options |
| `CONTENTFUL_REVALIDATE_SECONDS` | Optional | Cache revalidation interval in seconds |
| `USE_LOCAL_CONTENTFUL_FIXTURE` | Local demo | Set to `true` to run without Contentful credentials |

## Local Demo

Run the app with safe fixture content:

```bash
USE_LOCAL_CONTENTFUL_FIXTURE=true pnpm dev
```

Open `http://localhost:3000`.

Fixture mode renders the storefront from `contentful-test-configs.json`, so no client CMS credentials are required. The NBU exchange-rate integration can still be called by pricing logic when needed.

## Development

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Run quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Build for production:

```bash
pnpm build
```

## Project Structure

```text
src/app          App Router routes, API routes, and page-level UI
src/app/components Reusable storefront and admin UI components
src/constants    UI constants, API paths, limits, and integration names
src/hooks        Client-side state and interaction hooks
src/lib          Business logic, Contentful, Telegram, pricing, and storage helpers
src/types        Shared TypeScript contracts
tests            Unit tests for domain logic and request helpers
```

## Security Notes

- Server-only tokens are read through `process.env` and are never exposed through `NEXT_PUBLIC_*`.
- Admin cookies are `httpOnly` and `secure` in production.
- Admin login and Telegram order submission include basic rate limiting.
- Telegram API failures return a generic client-facing error instead of raw upstream responses.
- Public repository hygiene is enforced through `.gitignore` for env files, local IDE files, build output, and package-manager noise.

If this repository is made public after private development, rotate any production tokens that were ever committed to git history before publishing.
