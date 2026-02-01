import { pgTable, text, timestamp, uuid, integer, real, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const testStatusEnum = pgEnum('test_status', ['stable', 'flaky', 'quarantined']);
export const runStatusEnum = pgEnum('run_status', ['pass', 'fail', 'skip', 'error']);
export const quarantineModeEnum = pgEnum('quarantine_mode', ['soft_fail', 'skip', 'retry']);
export const detectionTypeEnum = pgEnum('detection_type', ['same_commit', 'statistical', 'transition']);
export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'member', 'viewer']);

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  apiKey: text('api_key').notNull().unique(),
  githubRepo: text('github_repo'),
  githubInstallationId: text('github_installation_id'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  githubId: text('github_id').unique(),
  role: userRoleEnum('role').default('member').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tests (unique tests tracked across runs)
export const tests = pgTable('tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  fingerprint: text('fingerprint').notNull(),
  name: text('name').notNull(),
  filePath: text('file_path'),
  suiteName: text('suite_name'),
  flakinessScore: real('flakiness_score').default(0).notNull(),
  status: testStatusEnum('status').default('stable').notNull(),
  firstSeenAt: timestamp('first_seen_at').defaultNow().notNull(),
  lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
  aiClassification: text('ai_classification'),
  aiConfidence: real('ai_confidence'),
});

// Test Runs (individual test executions)
export const testRuns = pgTable('test_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  testId: uuid('test_id').notNull().references(() => tests.id),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  commitSha: text('commit_sha'),
  branch: text('branch'),
  prNumber: integer('pr_number'),
  status: runStatusEnum('status').notNull(),
  durationMs: integer('duration_ms'),
  errorMessage: text('error_message'),
  stackTrace: text('stack_trace'),
  ciProvider: text('ci_provider'),
  runnerId: text('runner_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Flaky Detections
export const flakyDetections = pgTable('flaky_detections', {
  id: uuid('id').primaryKey().defaultRandom(),
  testId: uuid('test_id').notNull().references(() => tests.id),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  detectionType: detectionTypeEnum('detection_type').notNull(),
  flakinessScore: real('flakiness_score').notNull(),
  confidence: real('confidence').notNull(),
  evidence: jsonb('evidence').default({}),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
});

// Quarantine Rules
export const quarantineRules = pgTable('quarantine_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  testId: uuid('test_id').notNull().references(() => tests.id),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  mode: quarantineModeEnum('mode').default('soft_fail').notNull(),
  autoCreated: boolean('auto_created').default(false).notNull(),
  reason: text('reason'),
  threshold: real('threshold'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
