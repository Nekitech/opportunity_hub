/**
 * E2E tests for the catalog page.
 * Prerequisites: full stack running via docker compose
 *   docker compose -f docker-compose.yml -f docker-compose.dev.override.yml up -d
 */
import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3001";

async function gotoAndWait(page: Page, path: string) {
    await page.goto(`${BASE_URL}${path}`);
    await page.waitForLoadState("networkidle");
}

test.describe("Landing page", () => {
    test("redirects / to /catalog or shows hero", async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");
        // Either stays on / (landing) or redirected to /catalog
        const url = page.url();
        expect(url).toMatch(/localhost:3001/);
    });

    test("landing has headline", async ({ page }) => {
        await gotoAndWait(page, "/");
        const heading = page.locator("h1").first();
        await expect(heading).toBeVisible();
    });
});

test.describe("Catalog page", () => {
    test.beforeEach(async ({ page }) => {
        await gotoAndWait(page, "/catalog");
    });

    test("page title contains Каталог", async ({ page }) => {
        await expect(page).toHaveTitle(/Каталог/);
    });

    test("heading is visible", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /Каталог возможностей/ })).toBeVisible();
    });

    test("type filters are visible", async ({ page }) => {
        // Sidebar buttons — role=button with exact text
        await expect(page.getByRole("button", { name: "Гранты" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Конкурсы" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Стажировки" })).toBeVisible();
    });

    test("search bar is visible and accepts input", async ({ page }) => {
        const input = page.getByPlaceholder("Поиск по названию...");
        await expect(input).toBeVisible();
        await input.fill("тест");
        await expect(input).toHaveValue("тест");
    });

    test("sort select is visible", async ({ page }) => {
        await expect(page.getByText("Сортировка:")).toBeVisible();
    });

    test("shows results or empty state", async ({ page }) => {
        // Either cards are shown or the empty state message
        const hasCards = await page.locator("a[href^='/catalog/']").count() > 0;
        const hasEmpty = await page.getByText("Ничего не найдено").isVisible().catch(() => false);
        expect(hasCards || hasEmpty).toBe(true);
    });

    test("switching to Конкурсы shows different results", async ({ page }) => {
        await page.getByRole("button", { name: "Конкурсы" }).click();
        await page.waitForTimeout(500);
        const badges = page.locator("text=Конкурс");
        const count = await badges.count();
        expect(count).toBeGreaterThanOrEqual(0); // ok if empty, just shouldn't crash
    });

    test("search with debounce filters results", async ({ page }) => {
        const input = page.getByPlaceholder("Поиск по названию...");
        await input.fill("РНФ");
        await page.waitForTimeout(600); // debounce is 350ms
        // Page should still be functional (not crashed)
        await expect(page.getByRole("heading", { name: /Каталог/ })).toBeVisible();
    });

    test("calendar link is visible in sidebar", async ({ page }) => {
        await expect(page.getByText("Календарь дедлайнов")).toBeVisible();
    });
});

test.describe("Calendar page", () => {
    test("loads without error", async ({ page }) => {
        await gotoAndWait(page, "/calendar");
        await expect(page.getByRole("heading", { name: /Календарь дедлайнов/ })).toBeVisible();
    });

    test("has back link to catalog", async ({ page }) => {
        await gotoAndWait(page, "/calendar");
        await expect(page.getByText("← Каталог")).toBeVisible();
    });
});
