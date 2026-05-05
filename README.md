# DQL Consumption Assistant

A [Dynatrace App](https://developer.dynatrace.com) that tracks **DQL (Dynatrace Query Language) consumption costs** across your entire environment. It helps teams identify which dashboards, notebooks, users, apps, and queries are driving on-demand spend and automatically enforces limits before bills grow unchecked.

---

## What It Does

1. **Track consumption** — 15 analytical views across dashboards, notebooks, users, apps, and queries, each showing GiB scanned and cost.
2. **Calculate costs** — translates raw GiB into dollar figures using your account's rate card or Dynatrace's public default.
3. **Audit best practices** — flags queries that are missing DQL performance best practices.
4. **Enforce thresholds** — a daily workflow checks per-user consumption against global and group-level GiB thresholds.
5. **Manage cooldown groups** — over-threshold users are automatically added to restriction groups in cooldown group.
6. **Notify stakeholders** — sends a daily summary email of who was added, removed, or unchanged across Logs, Events, and Traces.
7. **Configure rate card** — switch between your account's contracted rates and Dynatrace's public rate card without touching code.

---

## Getting Started

### Prerequisites

- **Node.js** `>=22.0.0`
- Access to a **Dynatrace tenant** with:
  - All OAuth scopes listed in the [Architecture & Design](docs/Architecture.md#required-oauth-scopes)

### Install

```bash
npm install
```

### Run Locally

You do not need to deploy the app to use it. Running it locally connects to whichever Dynatrace tenant is configured in `app.config.json`.

```bash
npm run start
```

This opens the app in your browser with hot reload enabled. The dev server mounts mock settings from `settings/local-mock-data/values.json`, so rate card and threshold configuration is available immediately without deploying the Settings schema to your environment.

### Deploy to Dynatrace

```bash
npm run deploy
```

After deploying, navigate to **Dynatrace → Apps → DQL Consumption Assistant** and open **Settings → DQL Consumption** to complete the configuration before running the workflow.

---

## Configuration

All configuration lives in the **Settings** screen inside the app (or in `settings/local-mock-data/values.json` for local development). There are no `.env` files — the Dynatrace SDK handles auth context.

Update `environmentUrl` in `app.config.json` to point at your own tenant before running or deploying.

> When using the Account Rate Card, a valid OAuth2 client is required with scopes `account-uac-read`, `account-idm-read`, and `account-idm-write`. The Account ID field should contain only the UUID — omit the `urn:dtaccount:` prefix. If the account rate card fetch fails or returns empty, the app falls back to Dynatrace's public default rate card automatically.

---

## DQL Consumption Workflow

The app ships with an automation workflow that runs **daily at 10:00 AM** to enforce consumption limits across your organization. Once the initial setup is complete — including the recipient email address for cooldown notifications and the cooldown group names per data type — it reads everything from the app's Settings screen and handles threshold evaluation, group membership changes, and email delivery automatically.

### Settings Reference

| Setting                   | Type     | Required | Description                                                                                               |
| ------------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| **Rate Card**             | Dropdown | Yes      | `Account Rate Card` uses your org's contracted pricing; `Default Rate Card` uses Dynatrace's public rates |
| **OAuth2 Client ID**      | Text     | Yes      | Required scopes: `account-uac-read`, `account-idm-read`, `account-idm-write`                              |
| **OAuth2 Client Secret**  | Secret   | Yes      | Authenticates requests to Dynatrace Account Management API                                                |
| **OAuth2 Account ID**     | Text     | Yes      | Your account UUID — do not include the `urn:dtaccount:` prefix                                            |
| **Global Threshold**      | Number   | Yes      | Default: `100 GiB`. Applied to all users not covered by a custom threshold                                |
| **Custom Thresholds**     | List     | No       | Per-group overrides as `(Group Name, Threshold)` pairs — e.g. DevOps → 500, Viewers → 50                  |
| **Logs Cooldown Group**   | Text     | No       | IAM group to restrict users who exceed their threshold for Log queries                                    |
| **Events Cooldown Group** | Text     | No       | IAM group to restrict users who exceed their threshold for Event queries                                  |
| **Traces Cooldown Group** | Text     | No       | IAM group to restrict users who exceed their threshold for Trace queries                                  |

---

## Architecture & Design

For data flow, workflow, routes, and tech stack details, see [docs/Architecture.md](docs/Architecture.md).

---

## Routes

| Route                           | Page                                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| `/`                             | Welcome — landing page with navigation overview                   |
| `/top-dashboards`               | Top Dashboards — ranked by total DQL cost                         |
| `/dashboard-users`              | Dashboard Users — consumption per user, scoped to dashboards      |
| `/dashboard-queries`            | Dashboard Queries — individual queries executed inside dashboards |
| `/top-notebooks`                | Top Notebooks — ranked by total DQL cost                          |
| `/notebooks-users`              | Notebook Users — consumption per user, scoped to notebooks        |
| `/notebooks-queries`            | Notebook Queries — individual queries executed inside notebooks   |
| `/top-users`                    | Top Users — ranked by total DQL cost across all sources           |
| `/users-apps`                   | Users → Apps — app breakdown per user                             |
| `/users-queries`                | Users → Queries — query breakdown per user                        |
| `/top-apps`                     | Top Apps — Dynatrace apps ranked by total DQL cost                |
| `/apps-users`                   | App Users — consumption per user, scoped to each app              |
| `/apps-queries`                 | App Queries — individual queries executed by each app             |
| `/top-queries`                  | Top Queries — all queries ranked by total DQL cost                |
| `/query-without-best-practices` | Best Practices — queries missing DQL performance best practices   |
| `*`                             | 404 — page not found                                              |

---

## Tech Stack

| Layer                 | Technology                                            |
| --------------------- | ----------------------------------------------------- |
| Framework             | React 18.3.1, React Router DOM 7.12.0                 |
| Language              | TypeScript 5.9.3                                      |
| UI Components         | Dynatrace Strato Components 1.14.0 + Preview 2.11.2   |
| Styling               | Styled Components 6.1.19                              |
| State & Data Fetching | React Context, custom DQL hooks (`useCustomDqlQuery`) |
| i18n                  | React Intl 7.1.14                                     |
| Validation            | Zod 4.0.14                                            |
| Build Tool            | Dynatrace App Toolkit (`dt-app` 1.4.2)                |
| Backend               | Dynatrace SDK clients — no standalone server          |

---

## Limitations

- **No historical trending** — the app shows consumption for a selected timeframe but does not store snapshots or support trend comparisons over time.
- **Platform-locked** — the app runs inside the Dynatrace browser shell. It cannot be deployed as a standalone web server.

---

> **This repository is archived and is no longer maintained.**
>
> No bug fixes, feature updates, or pull requests will be accepted. The code is provided as-is for reference only. For supported Dynatrace app development resources, visit the [Dynatrace Developer Portal](https://developer.dynatrace.com).
