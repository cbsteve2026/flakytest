# 🧪 FlakyTest

**Detect, quarantine, and fix flaky tests automatically.**

---

## The Problem

Flaky tests are the silent productivity killer in engineering organizations. Studies show that **teams waste 6–8 hours per week** dealing with flaky tests — re-running pipelines, investigating false failures, and losing trust in their test suite.

The result? Developers start ignoring test failures. CI becomes a bottleneck instead of a safety net. Shipping velocity drops. Morale suffers.

## How It Works

FlakyTest integrates into your existing CI pipeline in three simple steps:

### 1. Install the SDK
Add the FlakyTest SDK to your CI configuration. It automatically collects test results from JUnit XML, TAP, or custom reporters — zero changes to your test code.

```bash
npm install @flakytest/sdk
```

### 2. Detect Flakiness
Our detection engine analyzes test results using statistical models:
- Same commit, different results → flaky
- Flakiness scoring based on pass/fail history
- Pattern recognition across test runs

### 3. Auto-Quarantine
Flaky tests are automatically quarantined in CI — they still run, but they can't block your pipeline. When they're fixed, they're automatically un-quarantined.

## Key Features (Planned)

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Root Cause Analysis** | Automatically categorize why tests are flaky: timing issues, test ordering, resource contention, environment differences, data dependencies |
| 🔒 **Automatic Quarantine** | Flaky tests are soft-failed or skipped in CI so they stop blocking deploys |
| 🔗 **GitHub/GitLab Integration** | PR comments, status checks, and auto-labels for flaky tests |
| 📊 **Dashboard & Trends** | See flakiness trends over time, top offenders, and team impact metrics |
| 🔄 **Smart Re-run Strategies** | Intelligent retry logic that minimizes CI time while maximizing signal |
| 🛡️ **Prevention Insights** | Don't just detect — get actionable recommendations to prevent flakiness |

## Target Audience

- **Mid-market engineering teams** (50–500 engineers)
- Teams running 100s–1000s of tests per CI run
- Organizations where CI reliability directly impacts shipping velocity
- **Free tier** available for open-source projects and small teams

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend API** | Node.js, TypeScript, Hono |
| **Database** | PostgreSQL with Drizzle ORM |
| **SDK** | TypeScript, supports Node.js CI environments |
| **Monorepo** | pnpm workspaces, Turborepo |
| **CI/CD** | GitHub Actions |
| **Infrastructure** | Vercel (web), Railway/Fly.io (API), Neon (database) |

## Project Structure

```
flakytest/
├── apps/
│   ├── web/          # Next.js dashboard & marketing site
│   └── api/          # Backend API server
├── packages/
│   ├── sdk/          # CI integration SDK
│   ├── db/           # Database schema & migrations
│   └── shared/       # Shared types and utilities
└── .github/
    └── workflows/    # CI configuration
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/junjizhi/flakytest.git
cd flakytest

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## License

Private — All rights reserved.
