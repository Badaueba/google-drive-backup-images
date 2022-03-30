import { ElementHandle, Page } from "puppeteer";
import { screenShot } from ".";

const driveUrl = String(process.env["drive_url"]);

export async function scrapFolder(page: Page) {
    const main = await page.waitForSelector('div[data-view-type="1"]');
    const folders = (await main?.$$("div[data-target=doc]")) || [];

    let count = 3;
    console.time("scrap routine");
    while (count === 3) {
        const main = await page.waitForSelector('div[data-view-type="1"]');
        const folders = (await main?.$$("div[data-target=doc]")) || [];
        const folder = folders[count];
        await folder.click({ clickCount: 2 });
        await scrapSubfolder(page, folder);
        count++;
    }
    console.timeEnd("scrap routine");
}

async function scrapSubfolder(page: Page, folder: ElementHandle) {
    await page.waitFor(1000);

    const mainSelector = 'div[data-view-type="1"]';
    const thumbSelector = "div[role=gridcell]";

    const main = await page.waitForSelector(mainSelector);
    await page.waitForSelector(thumbSelector, { timeout: 3000 });

    let thumbs = (await main?.$$(thumbSelector)) || [];

    const sources: string[] = [];
    let sourceCount = 0;

    while (sourceCount <= thumbs.length - 1) {
        const main = await page.waitForSelector(mainSelector);
        await page.waitForSelector(thumbSelector);
        thumbs = (await main?.$$(thumbSelector)) || [];

        const thumb = thumbs[sourceCount];

        console.log(
            "LIST OF files to open",
            `${thumbs.indexOf(thumb)}/${thumbs.length}`
        );

        if (thumb) {
            await thumb.click({ clickCount: 2 });
        }

        await page.waitFor(1000);
        const nodeListSelector = 'img[alt~="Exibindo"].a-b-ta-Ua';
        const openFiles = await page.$$(nodeListSelector);

        for (const el of openFiles) {
            const srcProperty = await el.getProperty("src");
            const src: string = await srcProperty.jsonValue();
            if (sources.indexOf(src) === -1) sources.push(src);
        }

        await page.keyboard.press("Escape", {
            delay: 1000,
        });

        sourceCount++;
    }

    console.log(sources);
    await page.goto(driveUrl);
}

// nodeListSelector = document.querySelectorAll('img[alt~="Exibindo"].a-b-ta-Ua');
// openFiles = Array.from(nodeListSelector)
// var sources = []
// for (var el of openFiles) {
//     var src = el.src;
//      if (sources.indexOf(el) === -1) {
//          sources.push(src);
//          console.log(el);
//      }
// }
