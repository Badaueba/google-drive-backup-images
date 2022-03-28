import { ElementHandle, Page } from "puppeteer";

export async function doubleClick(page: Page, element: ElementHandle) {
    await page.evaluate((el) => {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent("dblclick", true, true);
        el.dispatchEvent(clickEvent);
    }, element);
}
