# FlakyTest — Architecture

## Overview

FlakyTest is a SaaS platform that detects, quarantines, and helps fix flaky tests in CI pipelines. The architecture is designed around a simple data flow: **collect → analyze → act**.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   CI Runner  │────▶│  FlakyTest  │────▶│  Detection &     │────▶│  Dashboard  │
│  (SDK)       │     │  API        │     │  Classification  │     │  & Alerts   │
└─────────────┘     └─────────────┘     └──────────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌─────────────┐     ┌──────────────────┐
                    │  PostgreSQL │     │  Quarantine       │
                    │  Database   │     │  Engine           │
                    └─────────────┘     └──────────────────┘
                                               │
                                               ▼
                                        ┌──────────────────┐
                                        │  GitHub/GitLab   │
                                        │  Integration     │
                                        └──────────────────┘
```

---

## Components

### 1. SDK (Client-Side)

The SDK runs inside customers' CI environments and is responsible for collecting and reporting test results.

**Responsibilities:**
- Parse test results from standard formats (JUnit XML, TAP, JSON reporters)
- Generate stable **test fingerprints** (hash of test file + test name + suite) for tracking across runs
- Collect CI metadata (commit SHA, branch, PR number, CI provider, runner info)
- Batch and upload results to the FlakyTest API
- Check quarantine list and modify test behavior (skip/soft-fail quarantined tests)

**Supported Formats:**
- JUnit XML (universal — Jest, pytest, JUnit, Go, etc.)
- TAP (Test Anything Protocol)
- Custom reporters (Jest, Vitest, Playwright, pytest plugins)

**Integration Modes:**
1. **Post-run reporter** — Runs after tests complete, parses output files
2. **Inline reporter** — Plugs into test framework's reporter API for real-time streaming
3. **CI wrapper** — Wraps test command, handles both collection and quarantine

```typescript
// Example: Post-run usage
import { FlakyTest } from '@flakytest/sdk';

const client = new FlakyTest({ apiKey: process.env.FLAKYTEST_API_KEY });
await client.reportResults('./junit-results.xml');
```

### 2. API Server

The backend API handles ingestion, storage, and serves the dashboard.

**Tech Stack:** Node.js, TypeScript, Hono framework

**Key Endpoints:**
```
POST /api/v1/results          # Ingest test results from SDK
GET  /api/v1/quarantine       # Get quarantine list for a project (SDK pulls this)
POST /api/v1/quarantine       # Manually quarantine/unquarantine a test
GET  /api/v1/projects/:id/tests       # List tests with flakiness data
GET  /api/v1/projects/:id/dashboard   # Dashboard aggregations
POST /api/v1/webhooks/github          # GitHub webhook handler
```

**Authentication:**
- API keys for SDK (project-scoped)
- OAuth (GitHub/GitLab) for dashboard users
- JWT sessions for web app

### 3. Detection Engine

The core intelligence layer that identifies flaky tests from historical data.

**Detection Strategies:**

#### a) Same-Commit Analysis
If the same test produces different results on the same commit (across retries or parallel runs), it's definitively flaky.

```
Commit abc123:
  - Run 1: test_login → PASS
  - Run 2: test_login → FAIL
  → Flaky! (100% confidence)
```

#### b) Flakiness Score
A rolling score based on pass/fail history over a configurable window (default: 30 days).

```
Flakiness Score = (transitions between pass↔fail) / (total runs) × 100

Score > 5%  → "Slightly flaky"
Score > 15% → "Moderately flaky"
Score > 30% → "Highly flaky"
```

#### c) Statistical Analysis
- **Transition rate:** How often does the test flip between pass/fail?
- **Failure clustering:** Do failures cluster around certain times, runners, or branches?
- **Failure correlation:** Do certain tests always fail together (shared root cause)?

### 4. Quarantine Engine

Automatically manages which tests should be quarantined in CI.

**Quarantine Modes:**
1. **Soft-fail** — Test runs but its failure doesn't block the pipeline
2. **Skip** — Test is skipped entirely (faster, but loses signal)
3. **Retry** — Test is retried N times, only fails if all retries fail

**Quarantine Rules:**
```typescript
interface QuarantineRule {
  testFingerprint: string;
  mode: 'soft-fail' | 'skip' | 'retry';
  reason: string;
  createdAt: Date;
  expiresAt: Date;        // Auto-unquarantine after this date
  autoCreated: boolean;   // true if system-created, false if manual
  threshold: number;      // Flakiness score that triggered quarantine
}
```

**Auto-Quarantine Flow:**
1. Detection engine identifies test with flakiness score > threshold
2. Quarantine rule is created automatically
3. SDK pulls quarantine list at start of next CI run
4. Quarantined tests are soft-failed/skipped
5. Notification sent (Slack, email, PR comment)
6. If test stabilizes (passes consistently for N runs), auto-unquarantine

### 5. AI Classification Engine

Uses LLMs to analyze test failure patterns and categorize root causes.

**Root Cause Categories:**
| Category | Indicators |
|----------|-----------|
| **Timing/Race Condition** | Timeout errors, "element not found", async-related failures |
| **Test Ordering** | Passes in isolation, fails in suite; depends on global state |
| **Resource Contention** | Port conflicts, file locks, database connections |
| **Environment** | Passes locally, fails in CI; OS-specific failures |
| **Data Dependency** | External API calls, stale fixtures, shared test data |
| **Non-determinism** | Random values, hash ordering, floating point |

**How It Works:**
1. Collect failure messages, stack traces, and test code
2. Analyze patterns across multiple failures of the same test
3. Use LLM to classify root cause and suggest fixes
4. Present findings in dashboard with confidence scores

### 6. Dashboard (Web App)

Next.js application providing visibility into test health.

**Key Views:**
- **Overview** — Total tests, flaky count, quarantined count, trend graphs
- **Flaky Tests** — Sortable list with flakiness score, last failure, root cause
- **Test Detail** — Individual test history, failure messages, AI analysis
- **Quarantine Manager** — Active quarantine rules, auto/manual, expiration
- **Team Impact** — Time wasted on flaky tests, CI minutes saved by quarantine
- **Settings** — Project config, integrations, notification preferences

### 7. GitHub/GitLab Integration

Brings flaky test information directly into the developer workflow.

**Features:**
- **PR Status Check** — "FlakyTest: 3 flaky tests detected" with details
- **PR Comments** — Summary of flaky tests affected by the PR
- **Auto-Labels** — Apply labels like `flaky-test` to PRs that touch flaky tests
- **Issue Creation** — Auto-create issues for newly detected flaky tests
- **Commit Status** — Show flakiness score in commit status

---

## Data Model (Core Entities)

```
projects
├── id, name, slug, api_key, settings
├── github_repo, github_installation_id
└── created_at, updated_at

users
├── id, email, name, avatar_url
├── github_id, role
└── created_at

tests
├── id, project_id, fingerprint
├── name, file_path, suite_name
├── flakiness_score, status (stable|flaky|quarantined)
├── first_seen_at, last_seen_at
└── ai_classification, ai_confidence

test_runs
├── id, test_id, project_id
├── commit_sha, branch, pr_number
├── status (pass|fail|skip|error)
├── duration_ms, error_message, stack_trace
├── ci_provider, runner_id
└── created_at

flaky_detections
├── id, test_id, project_id
├── detection_type (same_commit|statistical|transition)
├── flakiness_score, confidence
├── evidence (JSON — supporting data)
└── detected_at

quarantine_rules
├── id, test_id, project_id
├── mode (soft_fail|skip|retry)
├── auto_created, reason
├── threshold, expires_at
└── created_at, updated_at
```

---

## Infrastructure

| Component | Service | Rationale |
|-----------|---------|-----------|
| Web app | Vercel | Zero-config Next.js deployment |
| API server | Railway or Fly.io | Low-latency, auto-scaling |
| Database | Neon PostgreSQL | Serverless Postgres, branching for dev |
| Queue | BullMQ + Redis | Background jobs (detection, AI analysis) |
| Object storage | S3/R2 | Raw test result artifacts |
| Monitoring | Sentry + Axiom | Error tracking + structured logging |

---

## Security Considerations

- All API communication over HTTPS
- API keys are project-scoped and rotatable
- Test result data is isolated per project (row-level security)
- No customer source code is stored — only test names, results, and metadata
- SOC 2 Type II compliance planned for enterprise tier
- Data retention policies configurable per project
