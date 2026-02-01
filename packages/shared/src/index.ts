/**
 * Shared types and utilities for FlakyTest
 */

// Test status types
export type TestStatus = 'stable' | 'flaky' | 'quarantined';
export type RunStatus = 'pass' | 'fail' | 'skip' | 'error';
export type QuarantineMode = 'soft_fail' | 'skip' | 'retry';
export type DetectionType = 'same_commit' | 'statistical' | 'transition';
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

// AI classification categories
export type FlakyCause =
  | 'timing'
  | 'ordering'
  | 'resource_contention'
  | 'environment'
  | 'data_dependency'
  | 'non_determinism'
  | 'unknown';

export interface Project {
  id: string;
  name: string;
  slug: string;
}

export interface Test {
  id: string;
  projectId: string;
  fingerprint: string;
  name: string;
  filePath?: string;
  suiteName?: string;
  flakinessScore: number;
  status: TestStatus;
}

export interface TestRun {
  id: string;
  testId: string;
  commitSha?: string;
  branch?: string;
  prNumber?: number;
  status: RunStatus;
  durationMs?: number;
  errorMessage?: string;
  createdAt: string;
}

// Flakiness score thresholds
export const FLAKINESS_THRESHOLDS = {
  SLIGHTLY_FLAKY: 5,
  MODERATELY_FLAKY: 15,
  HIGHLY_FLAKY: 30,
  AUTO_QUARANTINE: 20,
} as const;

/**
 * Classify flakiness severity based on score.
 */
export function classifyFlakiness(score: number): 'stable' | 'slightly_flaky' | 'moderately_flaky' | 'highly_flaky' {
  if (score >= FLAKINESS_THRESHOLDS.HIGHLY_FLAKY) return 'highly_flaky';
  if (score >= FLAKINESS_THRESHOLDS.MODERATELY_FLAKY) return 'moderately_flaky';
  if (score >= FLAKINESS_THRESHOLDS.SLIGHTLY_FLAKY) return 'slightly_flaky';
  return 'stable';
}
