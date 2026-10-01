import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const output = process.env.ANIMA_QA_OUTPUT_DIR || 'work/qa';
await fs.mkdir(output, { recursive: true });
for (const viewport of [
  { width: 1440, height: 1080 },
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const path of [
    '/',
    '/journal',
    '/cycles',
    '/rituals',
    '/session',
    '/soul-map',
    '/profile',
    '/future-self',
    '/crisis',
  ]) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () =>
        getComputedStyle(document.querySelector('.page-enter')).opacity === '1',
    );
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
      shell: document
        .querySelector('.app-shell')
        .getBoundingClientRect()
        .toJSON(),
      main: document
        .querySelector('.main-wrap')
        .getBoundingClientRect()
        .toJSON(),
      root: document.getElementById('root').getBoundingClientRect().toJSON(),
    }));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.push({
      viewport,
      path,
      layout,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    if (path === '/' && viewport.width !== 820) {
      await page.screenshot({
        path:
          viewport.width === 1440
            ? `${output}/anima-desktop.png`
            : `${output}/anima-mobile.png`,
        fullPage: true,
      });
    }
  }
  await context.close();
}
await fs.writeFile(
  `${output}/visual-report.json`,
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    report.map((r) => ({
      width: r.viewport.width,
      path: r.path,
      overflow: r.layout.content > r.viewport.width,
      shellWidth: r.layout.shell.width,
      mainWidth: r.layout.main.width,
      issues: r.violations.map((v) => ({ id: v.id, count: v.nodes.length })),
    })),
    null,
    2,
  ),
);
await browser.close();

if (
  report.some((r) => r.layout.content > r.viewport.width || r.violations.length)
)
  process.exitCode = 1;
