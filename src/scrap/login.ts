import { Page } from "puppeteer";

const email = String(process.env["user_email"]);
const password = String(process.env["user_password"]);

export async function login(page: Page) {
    const emailSelector = 'input[type="email"]';
    const passSelector = 'input[name="password"]';
    await page.waitForSelector(emailSelector);
    await page.click(emailSelector);
    await page.type(emailSelector, email);
    await page.keyboard.press("Enter");

    await page.waitForSelector(passSelector);
    await page.evaluate(
        (selector, value) => {
            let element = document.querySelector(selector) as HTMLInputElement;
            element.value = value;
            element.select();
            let btn = document.querySelector(
                "#passwordNext"
            ) as HTMLButtonElement;
            btn.click();
            return;
        },
        passSelector,
        password
    );
}
