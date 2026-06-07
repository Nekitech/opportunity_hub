import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    retries: 1,
    use: {
        baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3001",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    // e2e tests require running stack — not part of turbo test
    reporter: [["list"], ["html", { open: "never" }]],
});
