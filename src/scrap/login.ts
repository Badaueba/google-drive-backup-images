import { Page, PuppeteerErrors } from "puppeteer";

const email = String(process.env["user_email"]);
const password = String(process.env["user_password"]);
const driveBaseUrl = String(process.env["drive_base_url"]);

export async function login(page: Page) {
    const pageUrl = page.url();
    //already logged in
    if (pageUrl.includes(driveBaseUrl)) return;

    const emailSelector = 'input[type="email"]';
    const passSelector = 'input[name="Passwd"]';

    const emailInterval = setInterval(async () => {
        try {
            const emailElement = await page.waitForSelector(emailSelector, {
                timeout: 1000,
            });
            if (emailElement) {
                clearInterval(emailInterval);

                await page.click(emailSelector);
                await page.type(emailSelector, email);
                await page.keyboard.press("Enter");
            }
        } catch (err) {
            const error = err as Error;
            console.log(error.message);
        }
    }, 500);

    const passInterval = setInterval(async () => {
        try {
            const passElement = await page.waitForSelector(passSelector, {
                timeout: 1000,
            });
            console.log("here");
            if (passElement) {
                console.log(passElement);

                clearInterval(passInterval);

                await passElement.click();
                await page.type(passSelector, password);

                await page.keyboard.press("Enter");
            }
        } catch (err) {
            const error = err as Error;
            console.log(error.message);
        }
    }, 500);
}
