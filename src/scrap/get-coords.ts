import { ElementHandle, Page } from "puppeteer";

export async function getCoords(page: Page, element: ElementHandle) {
    const rect = await page.evaluate((el) => {
        const { x, y } = el.getBoundingClientRect();
        return { x, y };
    }, element);

    return rect;
}
