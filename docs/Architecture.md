# DQL Consumption Assistant — High-Level Design

## Tech Stack

| Layer                 | Technology                                   |
| --------------------- | -------------------------------------------- |
| Framework             | React, React Router DOM                      |
| Language              | TypeScript                                   |
| UI Components         | Dynatrace Strato Components                  |
| Styling               | Styled Components                            |
| State & Data Fetching | React Context, custom DQL hooks              |
| i18n                  | React Intl                                   |
| Validation            | Zod                                          |
| Build Tool            | Dynatrace App Toolkit (`dt-app`)             |
| Backend               | Dynatrace SDK clients — no standalone server |

---

## Data Flow

```
User opens a page
        │
        ▼
Page component mounts
  ├── Reads selected timeframe from TimeframeContext
  └── Reads rate card pricing from RateCardContext
        │
        ▼
Custom fetch hook (e.g. useFetchTopDashboards) runs
  └── Builds DQL query from queries.ts with the current timeframe
        │
        ▼
Dynatrace SDK (client-query) executes the DQL query
        │
        ▼
Data transformation
  ├── Bytes → GiB conversion
  ├── Cost = On-Demand GiB × rate card price
  └── Column definitions applied (useCommonColumnsForInsights)
        │
        ▼
GenericDataTable renders results
  ├── Sort · filter · search · column toggle
  └── CSV / JSON export available
```

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

## Workflow

```
Trigger: Daily @ 10:00 AM
        │
        ▼
1. Get Rate Card
   Fetches the account-specific rate card via OAuth2.
   Falls back to the default rate card if unavailable.
        │
        ▼
2. Calculate User DQL Consumption          (runs per data type: Events · Logs · Traces)
   Executes a DQL query against dt.system.query_executions.
   Checks each user against all configured thresholds.
   Selects the highest exceeded threshold as the effective limit.
   Returns: user list with cost, group name, and group UUID.
        │
        ▼
3. Adjust Cooldown Group Membership        (runs per data type: Events · Logs · Traces)
   Compares current group membership against threshold results.
   ├── Threshold exceeded    → add user to cooldown group
   ├── Threshold no longer exceeded → remove user from cooldown group
   └── Already correct      → skip (no API call made)
   If no cooldown group is configured → passes result through unchanged.
        │
        ▼
4. Send Summary Email                      (runs per data type: Events · Logs · Traces)
   Emails a summary of all user status changes.
   Includes a support link for users who need assistance.
```

> Users may belong to multiple groups with different thresholds. The workflow always selects the **highest exceeded threshold** as the effective one — so a user in both a DevOps group (500 GiB) and a Viewers group (50 GiB) who consumed 300 GiB will be evaluated against the DevOps threshold, not the Viewers one.

### Example Email Output

**With cooldown groups configured:**

```
User A : 520 GiB (>= 500 GiB for DevOps) - cooldown added
User B : 520 GiB (>= 500 GiB for DevOps) - cooldown skipped
User C : cooldown removed
```

**Without cooldown groups configured:**

```
User A : 520 GiB (>= 500 GiB for DevOps)

No cooldown group configured for Traces.
Please add a group in Settings.
```

---

## Required OAuth Scopes

The app checks these scopes before allowing workflow installation. The workflow actions also require them at execution time.

| Scope                       | Purpose                                                         |
| --------------------------- | --------------------------------------------------------------- |
| `storage:logs:read`         | Read log data for DQL consumption analysis                      |
| `storage:entities:read`     | Query entities via DQL                                          |
| `storage:system:read`       | Read system query execution data (`dt.system.query_executions`) |
| `storage:buckets:read`      | Read metric bucket data                                         |
| `app-settings:objects:read` | Read rate card and threshold configuration                      |
| `automation:workflows:read` | Query workflow list to detect existing installations            |
| `document:documents:read`   | Read dashboard documents                                        |

---
