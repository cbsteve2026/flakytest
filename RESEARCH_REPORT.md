# FlakyTest — Market Research Report

## Executive Summary

Flaky tests — tests that pass and fail non-deterministically without code changes — are one of the most pervasive and costly problems in modern software engineering. This report summarizes the market landscape, competitive positioning, and opportunity for a dedicated flaky test detection and quarantine SaaS product.

---

## The Problem

### Scale of Impact
- **Google** found that ~16% of their tests exhibit some flakiness, and flaky tests cost them significant engineering resources.
- **Microsoft** reported that flaky tests are responsible for a large fraction of wasted CI compute.
- **Industry surveys** consistently show that flaky tests waste **6–8 hours per week per engineering team**, translating to hundreds of thousands of dollars in lost productivity annually for mid-size organizations.

### Root Causes
Flaky tests typically stem from:
1. **Timing/concurrency issues** — Race conditions, async operations, sleep-based waits
2. **Test ordering dependencies** — Tests that rely on global state or execution order
3. **Resource contention** — Shared databases, file systems, network ports
4. **Environment differences** — CI vs. local, OS differences, timezone issues
5. **Data dependencies** — Tests relying on external APIs, seeded data, or shared fixtures
6. **Non-deterministic algorithms** — Random number generation, hash ordering

### Developer Pain
- Developers lose trust in the test suite and start ignoring failures
- CI pipelines become bottlenecks as teams "just re-run" failed builds
- Debugging intermittent failures is among the most frustrating engineering tasks
- New team members have no context on which tests are "known flaky"

---

## Market Landscape

### Existing Solutions

#### CI/CD Platforms with Flaky Test Features
- **BuildPulse** — Dedicated flaky test detection. Integrates with CI. YC-backed. Closest direct competitor.
- **Launchable** — AI-powered test intelligence. Predicts which tests to run. Broader scope than just flakiness.
- **Trunk Flaky Tests** — Part of Trunk.io's developer tools suite. Detection + quarantine.
- **Datadog CI Visibility** — Test tracking as part of broader observability. Enterprise-focused.
- **CircleCI Test Insights** — Built into CircleCI. Limited to their platform.
- **GitHub Actions** — No native flaky test detection.

#### Build/Test Platforms
- **Gradle Enterprise (now Develocity)** — Flaky test detection for JVM ecosystem. Enterprise pricing.
- **Bazel** — Has built-in `--flaky_test_attempts` but no intelligence layer.

#### Internal Tools (Open Source)
- **pytest-rerunfailures** — Simple retry plugin for Python. No intelligence.
- **Jest** — `--forceExit` and retry options, but no detection.
- **Flaky (Shopify)** — Ruby gem for marking flaky tests. Manual process.

### Market Gaps

1. **No dominant standalone product** — Most solutions are features within larger platforms, not dedicated products.
2. **Limited AI/ML application** — Most tools just detect flakiness via pass/fail patterns. Very few attempt root cause analysis.
3. **Poor quarantine automation** — Most quarantine processes are manual (add test to skip list, create ticket, forget about it).
4. **Cross-platform support** — Most tools are tied to specific CI providers or test frameworks.
5. **No prevention focus** — Existing tools are reactive. None help teams write less flaky tests proactively.

---

## Competitive Positioning

### FlakyTest Differentiators

| Capability | FlakyTest | BuildPulse | Trunk | Datadog |
|-----------|-----------|-----------|-------|---------|
| Flaky detection | ✅ | ✅ | ✅ | ✅ |
| Auto-quarantine | ✅ | ❌ | ✅ | ❌ |
| AI root cause analysis | ✅ | ❌ | ❌ | ❌ |
| Prevention insights | ✅ | ❌ | ❌ | ❌ |
| Framework-agnostic SDK | ✅ | ✅ | Partial | ✅ |
| Self-serve onboarding | ✅ | ✅ | ✅ | ❌ |
| Free tier for OSS | ✅ | ❌ | ✅ | ❌ |

### Target Market
- **Primary:** Mid-market engineering teams (50–500 engineers)
  - Large enough to feel the pain of flaky tests at scale
  - Small enough that they can't build internal tooling
  - Budget-conscious but willing to pay for developer productivity
- **Secondary:** Enterprise teams looking for a focused solution vs. platform bundles
- **Tertiary:** Open-source projects and small teams (free tier for community growth)

---

## Pricing Strategy (Initial Thinking)

| Tier | Price | Target |
|------|-------|--------|
| **Free** | $0 | OSS projects, <5 team members, <1,000 test runs/month |
| **Team** | $49/mo | Small teams, <20 members, 10,000 test runs/month |
| **Business** | $199/mo | Mid-market, <100 members, 100,000 test runs/month |
| **Enterprise** | Custom | Large orgs, unlimited, SSO, SLA, dedicated support |

---

## Go-to-Market Strategy

### Phase 1: Build & Validate (Months 1–3)
- Ship MVP: SDK + detection + basic dashboard
- Target 5–10 design partner teams
- Focus on JavaScript/TypeScript ecosystem (Jest, Vitest, Playwright)
- Content marketing: blog posts on flaky test patterns

### Phase 2: Launch & Grow (Months 4–6)
- Public launch on Product Hunt, Hacker News
- Add GitHub/GitLab integration
- Expand to Python (pytest), Java (JUnit), Go
- Auto-quarantine feature

### Phase 3: Differentiate (Months 7–12)
- AI root cause analysis
- Prevention insights and recommendations
- Team analytics and reporting
- Enterprise features (SSO, audit logs, SLA)

---

## Key Metrics to Track

- **Test runs processed** — Volume indicator
- **Flaky tests detected** — Core value metric
- **Time saved per team** — ROI metric
- **Quarantine accuracy** — Quality metric (false positive rate)
- **SDK adoption** — Growth indicator
- **Net Promoter Score** — Satisfaction

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| CI platforms add native features | Move faster on AI/ML differentiation; be framework-agnostic |
| Low willingness to pay | Strong free tier builds community; prove ROI clearly |
| SDK integration friction | Zero-config setup; support popular CI providers out of the box |
| Data privacy concerns | SOC 2 compliance roadmap; self-hosted option for enterprise |

---

## Conclusion

The flaky test problem is large, painful, and under-served by a dedicated product. Existing solutions are either features within larger platforms or simple retry mechanisms. There is a clear opportunity for a focused, AI-powered product that goes beyond detection to provide quarantine automation and prevention insights. The mid-market segment is particularly underserved and represents the ideal beachhead.
