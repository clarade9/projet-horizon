import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './agent',
  timeout: 120_000,
  use: {
    baseURL: process.env.QA_BASE_URL || 'https://projet-horizon-sem.vercel.app',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: false,
    trace: 'on',
    screenshot: 'on',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
