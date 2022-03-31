import { ElementHandle, Page } from "puppeteer";

const driveUrl = String(process.env["drive_url"]);

export async function scrapFolder(page: Page) {
    const main = await page.waitForSelector('div[data-view-type="1"]');
    const folders = (await main?.$$("div[data-target=doc]")) || [];

    let count = 0;
    console.time("scrap routine");
    while (count < folders.length) {
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
    const nodeListSelector = 'img[alt~="Exibindo"].a-b-ta-Ua';
    try {
        await page.waitForSelector(mainSelector);
    } catch (err) {
        console.warn("no files in folder");
    }

    const main = await page.$(mainSelector);
    await page.$(thumbSelector);
    if (!main) return;

    let thumbs = (await main?.$$(thumbSelector)) || [];

    const sources: string[] = [];
    let sourceCount = 0;

    while (sourceCount < thumbs.length) {
        const main = await page.waitForSelector(mainSelector);
        thumbs = (await main?.$$(thumbSelector)) || [];

        const thumb = thumbs[sourceCount];

        console.info(
            "SCRAPING SRC IMG",
            `${thumbs.indexOf(thumb) + 1}/${thumbs.length}`
        );

        if (thumb) {
            await thumb.click({ clickCount: 2, delay: 500 });
        }

        await page.waitFor(1600);

        const alternativeList = await page.$$eval(nodeListSelector, (files) => {
            const srcList = files.map((file) => (file as HTMLImageElement).src);
            return srcList;
        });

        const filtered = alternativeList.filter(
            (src) => sources.indexOf(src) === -1
        );
        sources.push(...filtered);

        await page.keyboard.press("Escape", {
            delay: 100,
        });

        sourceCount++;
    }

    console.info(
        "------------------------------FINISHED-------------------------------"
    );
    console.info("IMG SOURCES:", sources);
    await page.goto(driveUrl);
}
