import { ElementHandle, Page } from "puppeteer";

const driveUrl = String(process.env["drive_url"]);

export async function scrapFolder(page: Page) {
    const main = await page.waitForSelector('div[data-view-type="1"]');
    const folders = (await main?.$$("div[data-target=doc]")) || [];
    console.log("FOLDERS", folders?.length);
    let count = 3;
    while (count < folders.length) {
        const main = await page.waitForSelector('div[data-view-type="1"]');
        const folders = (await main?.$$("div[data-target=doc]")) || [];
        const folder = folders[count];
        await folder.click({ clickCount: 2 });
        console.log("inside LOOP ->>>>", count);
        await scrapSubfolder(page, folder, count);
        count++;
        console.log("\n\n");
    }
}

async function scrapSubfolder(
    page: Page,
    folder: ElementHandle,
    folderCount: number
) {
    await page.waitFor(3000);
    const mainSelector = 'div[data-view-type="1"]';
    const main = await page.waitForSelector(mainSelector);
    const thumbs = (await main?.$$("div[role=gridcell]")) || [];

    const sources = [];
    let sourceCount = -1;

    while (sourceCount <= thumbs.length - 1) {
        sourceCount++;
        console.log("COUNT COUNT", sourceCount);
        const main = await page.waitForSelector(mainSelector);
        const thumbs = (await main?.$$("div[role=gridcell]")) || [];

        const thumb = thumbs[sourceCount];
        console.log(
            "LIST OF thumbs",
            `${thumbs.indexOf(thumb)}/${thumbs.length}`
        );

        if (thumb) {
            await thumb.click({ clickCount: 2 });
        }

        await page.waitFor(3400);
        const nodeListSelector = 'img[alt~="Exibindo"].a-b-ta-Ua';
        const openFiles = await page.$$(nodeListSelector);
        thumbs.push(...(openFiles as ElementHandle[]));

        for (const el of openFiles) {
            const srcProperty = await el.getProperty("src");
            const src: string = await srcProperty.jsonValue();
            sources.push(src);
        }

        await page.keyboard.press("Escape", {
            delay: 3000,
        });

        console.log("THUMBS -> ", thumbs.length);
        console.log("SOURCES => ", sources.length);
        console.log("COUNT ->", sourceCount);
        //fix update count based on new discovered thumbs
    }

    console.log(JSON.stringify(sources));
    await page.goto(driveUrl);
}
