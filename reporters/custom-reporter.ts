import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
  Suite,
} from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

interface TestSummary {
  total:   number;
  passed:  number;
  failed:  number;
  skipped: number;
  flaky:   number;
  duration: number;
  failures: Array<{ title: string; error: string }>;
}

export default class CustomReporter implements Reporter {
  private summary: TestSummary = {
    total:    0,
    passed:   0,
    failed:   0,
    skipped:  0,
    flaky:    0,
    duration: 0,
    failures: [],
  };

  private startTime = Date.now();

  onBegin(_config: unknown, suite: Suite): void {
    this.startTime = Date.now();
    console.log(`\n🚀 Starting test run — ${suite.allTests().length} tests found\n`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.summary.total++;
    this.summary.duration += result.duration;

    const icon = {
      passed:  '✅',
      failed:  '❌',
      skipped: '⏭️',
      timedOut: '⏰',
      interrupted: '🛑',
    }[result.status] ?? '❓';

    console.log(`  ${icon} ${test.title} (${result.duration}ms)`);

    switch (result.status) {
      case 'passed':
        if (result.retry > 0) {
          this.summary.flaky++;
        } else {
          this.summary.passed++;
        }
        break;
      case 'failed':
      case 'timedOut':
        this.summary.failed++;
        this.summary.failures.push({
          title: test.title,
          error: result.errors[0]?.message ?? 'Unknown error',
        });
        break;
      case 'skipped':
        this.summary.skipped++;
        break;
    }
  }

  onEnd(result: FullResult): void {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const statusIcon = result.status === 'passed' ? '🎉' : '💥';

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${statusIcon} Test Run Complete — ${result.status.toUpperCase()}`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`  Total:    ${this.summary.total}`);
    console.log(`  ✅ Passed:  ${this.summary.passed}`);
    console.log(`  ❌ Failed:  ${this.summary.failed}`);
    console.log(`  ⏭️  Skipped: ${this.summary.skipped}`);
    console.log(`  🔄 Flaky:   ${this.summary.flaky}`);
    console.log(`  ⏱️  Duration: ${totalDuration}s`);

    if (this.summary.failures.length > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.summary.failures.forEach(f => {
        console.log(`   • ${f.title}`);
        console.log(`     ${f.error.substring(0, 120)}...`);
      });
    }

    console.log(`${'─'.repeat(60)}\n`);

    // Write JSON summary to disk
    this.writeSummaryToDisk();
  }

  private writeSummaryToDisk(): void {
    const outDir = 'test-results';
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, 'summary.json'),
      JSON.stringify(this.summary, null, 2)
    );
  }
}
