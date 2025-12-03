# Project Overview

## General
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma (PostgreSQL)
- **Authentication**: Custom session-based (`x-session-id`), bcrypt for passwords.
- **Documentation**: Swagger (`/api/docs`)

## Key Features
- **User Management**: Registration, roles (Customer/Admin).
- **Blogging**: Create and manage blog posts.
- **Subscriptions**: Stripe integration for plans and subscriptions.
- **Credit System**: Usage-based credits for AI features (Blog Gen, Summary, Translation, etc.).
- **Webhooks**: Handling Stripe webhooks.

## Architecture
- **Modules**:
    - `auth`: Authentication logic.
    - `user`: User profile and management.
    - `blog`: Blog post CRUD.
    - `plan`, `subscription`, `payment`, `stripe`: Billing and payments.
    - `credit-tracking`: Managing user credits.
    - `webhook`: External event handling.
- **Database**:
    - `User`, `AuthSession`
    - `Blog`
    - `Plan`, `Subscription`
    - `CreditSystem`, `CreditTracking`
    - `WebhookLog`

## Setup
- **Seed**: `npm run seed` (uses `src/common/database/seed.ts`)
- **Dev**: `npm run start:dev`
- **Test**: `npm run test` / `npm run test:e2e`
