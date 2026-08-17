// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,   // le jeu a un état global — ne pas paralléliser
  workers: 1,             // un seul worker pour partager le serveur et éviter les conflits
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    viewport: { width: 1280, height: 800 },
    // Ignore les erreurs console non critiques (audio, service worker)
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx serve . -p 8080 -s',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
