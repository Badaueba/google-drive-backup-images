import puppeteerExtra from "puppeteer-extra";
import { Browser, Page } from "puppeteer";
import extra from "puppeteer-extra-plugin-stealth";
import { login } from ".";
import { scrapFolder } from "./scrap-folder";

const background = process.env["background_task"] === "true" ? true : false;

puppeteerExtra.use(extra());

export class Scraper {
    private browser: Browser | Record<any, any> = {};
    constructor(private url: string) {}

    private async launch() {
        this.browser = await puppeteerExtra.launch({
            headless: background,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-infobars",
                "--window-position=0,0",
                "--ignore-certifcate-errors",
                "--ignore-certifcate-errors-spki-list",
            ],

            ignoreHTTPSErrors: false,
            userDataDir: "./tmp",
        });
    }

    async scrap() {
        await this.launch();
        const page: Page = await this.browser.newPage();
        await page.goto(this.url);
        await login(page);
        await scrapFolder(page);

        // await page.waitFor(180_000);
        await page.close();
        await this.browser.close();
    }
}
