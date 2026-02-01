/**
 * FlakyTest SDK
 *
 * Install this in your CI pipeline to collect test results
 * and integrate with the FlakyTest platform.
 */

export interface FlakyTestConfig {
  /** API key for your FlakyTest project */
  apiKey: string;
  /** API base URL (defaults to https://api.flakytest.dev) */
  baseUrl?: string;
  /** CI provider auto-detection override */
  ciProvider?: string;
}

export interface TestResult {
  name: string;
  suite: string;
  filePath?: string;
  status: 'pass' | 'fail' | 'skip' | 'error';
  durationMs: number;
  errorMessage?: string;
  stackTrace?: string;
}

export interface ReportOptions {
  /** Commit SHA (auto-detected from CI environment) */
  commitSha?: string;
  /** Branch name (auto-detected from CI environment) */
  branch?: string;
  /** PR number (auto-detected from CI environment) */
  prNumber?: number;
}

export interface QuarantineRule {
  testFingerprint: string;
  mode: 'soft-fail' | 'skip' | 'retry';
  reason: string;
  expiresAt: string;
}

/**
 * Generate a stable fingerprint for a test based on its identifying properties.
 */
export function generateFingerprint(name: string, suite: string, filePath?: string): string {
  const input = [name, suite, filePath].filter(Boolean).join('::');
  // Simple hash — will use proper hashing in production
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Main FlakyTest client for collecting and reporting test results.
 */
export class FlakyTest {
  private config: Required<Pick<FlakyTestConfig, 'apiKey'>> & FlakyTestConfig;

  constructor(config: FlakyTestConfig) {
    this.config = {
      baseUrl: 'https://api.flakytest.dev',
      ...config,
    };
  }

  /**
   * Report test results from a JUnit XML file.
   */
  async reportResults(junitXmlPath: string, options?: ReportOptions): Promise<void> {
    // TODO: Parse JUnit XML and send results to API
    console.log(`[FlakyTest] Reporting results from ${junitXmlPath}`);
  }

  /**
   * Report test results directly.
   */
  async report(results: TestResult[], options?: ReportOptions): Promise<void> {
    // TODO: Send results to API
    console.log(`[FlakyTest] Reporting ${results.length} test results`);
  }

  /**
   * Get the current quarantine list for this project.
   */
  async getQuarantineList(): Promise<QuarantineRule[]> {
    // TODO: Fetch quarantine rules from API
    return [];
  }

  /**
   * Check if a specific test is quarantined.
   */
  async isQuarantined(name: string, suite: string, filePath?: string): Promise<boolean> {
    const fingerprint = generateFingerprint(name, suite, filePath);
    const rules = await this.getQuarantineList();
    return rules.some((r) => r.testFingerprint === fingerprint);
  }
}

export default FlakyTest;
