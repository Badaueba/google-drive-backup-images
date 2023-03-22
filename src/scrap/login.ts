import { Page } from "puppeteer";

const email = String(process.env["user_email"]);
const password = String(process.env["user_password"]);
const driveBaseUrl = String(process.env["drive_base_url"]);

export async function login(page: Page) {
    const pageUrl = page.url();
    //already logged in
    if (pageUrl.includes(driveBaseUrl)) return;

    const emailSelector = 'input[type="email"]';
    const passSelector = 'input[type="password"]';

    await page.waitForSelector(emailSelector, { timeout: 5000 });

    await page.click(emailSelector);
    await page.type(emailSelector, email);
    await page.keyboard.press("Enter");

    const passInterval = setInterval(async () => {
        try {
            const passElement = await page.waitForSelector(passSelector, {
                timeout: 1000,
            });
            if (passElement) clearInterval(passInterval);
            console.log();

            await page.click(passSelector);
            await page.type(passSelector, password);

            await page.keyboard.press("Enter");
        } catch (e) {
            console.log(e);
        }
    }, 1000);
}
