import { existsSync, mkdirSync } from "fs";
import { cwd } from "process";
import { ElementHandle, Page } from "puppeteer";

export async function screenShot(
    page: Page,
    elements: ElementHandle[],
    folder: string
) {
    const rootPath = `${cwd()}/tmp/__images/${folder}/`;

    if (!existsSync(rootPath)) mkdirSync(rootPath);

    for (const el of elements) {
        const index = elements.indexOf(el);
        console.log("ELEMENT", typeof el, index);
        const filePath = `${cwd()}/tmp/__images/${folder}/${index}.jpg`;

        if (!existsSync(filePath))
            await el.screenshot({
                path: filePath,
                type: "jpeg",
                quality: 100,
            });
    }

    await page.waitFor(500);
}
