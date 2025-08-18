#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');

const OUT_DIR = 'screenshots';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ROUTES = ['/', '/login', '/register', '/builder'];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.status === 200) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond with 200 within ${timeoutMs}ms`);
}

async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  const homeUrl = `${BASE}/`;
  console.log('Waiting for server to be ready at', homeUrl);
  try {
    await waitForServer(homeUrl, 45000);
  } catch (err) {
    console.error('Server readiness check failed:', err.message);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  for (const route of ROUTES) {
    const url = `${BASE}${route}`.replace(/([^:]\/)\/+/g, '$1');
    const name = route === '/' ? 'home' : route.replace(/[^a-z0-9]/gi, '_').replace(/^_/, '');
    const outPath = `${OUT_DIR}/${name}.png`;
    console.log('Capturing', url, '->', outPath);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // wait a bit for any client rendering
      await page.waitForTimeout(500);
      await page.screenshot({ path: outPath, fullPage: true });
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
  console.log('Done. Screenshots saved to', OUT_DIR);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
