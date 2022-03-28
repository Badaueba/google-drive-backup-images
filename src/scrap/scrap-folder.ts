import { ElementHandle, Page } from "puppeteer";
import { doubleClick, getCoords } from ".";

const driveUrl = String(process.env["drive_url"]);

export async function scrapFolder(page: Page) {
    //found folders
    //div[draggable=true]
    //filter the folders
    //div[role=row]
    const main = await page.waitForSelector('div[data-view-type="1"]');
    const folders = (await main?.$$("div[data-target=doc]")) || [];
    console.log("FOLDERS", folders?.length);
    let count = 2;
    while (count < 10) {
        const main = await page.waitForSelector('div[data-view-type="1"]');
        const folders = (await main?.$$("div[data-target=doc]")) || [];
        const folder = folders[count];
        console.log("FOLDER?", typeof folder);
        await folder.click({ clickCount: 2 });
        console.log("inside LOOP ->>>>", count);
        await scrapSubfolder(page, folder);
        count === 0 ? (count += 2) : count++;
        console.log("\n\n");
    }
}

async function scrapSubfolder(page: Page, folder: ElementHandle) {
    console.log("INSIDE subfolder");
    await page.waitFor(5000);
    const mainSelector = 'div[data-view-type="1"]';
    const main = await page.waitForSelector(mainSelector);
    if (!main) throw "Not main root structure";
    const files = (await main?.$$("div[role=gridcell]")) || [];
    console.log("files", files?.length);
    const sources: string[] = [];
    const map: string = "";
    let count = 0;
    while (count < files.length) {
        const main = await page.waitForSelector(mainSelector);
        const files = (await main?.$$("div[role=gridcell]")) || [];
        const file = files[count];
        console.log(
            "LIST OF FILES",
            `${files.indexOf(file)}/${files.length} files: ${sources.length}`
        );
        await file.click({ clickCount: 2 });

        await page.waitForSelector(mainSelector);
        await page.waitFor(3000);
        const newSources = await scrapFile(page, file, map);
        sources.push(...newSources);
        map.concat(sources.join());
        console.log(map);
        count++;
    }

    await page.goto(driveUrl);
    console.log("--------------------------------------------------------");
    console.log(sources);
}

async function scrapFile(page: Page, File: ElementHandle, map: string) {
    const nodeListSelector = 'div[role="img"] > img:first-child';

    let sources = [];

    sources = await page.evaluate(
        (selector, map) => {
            let src;
            const sources: string[] = [];
            const img: any =
                document.querySelectorAll(selector)[0] ||
                document.querySelector(".a-b-ta-Ua");

            src = img?.src;

            if (!map.includes(src)) {
                sources.push(src);
                map.concat(src);
            }
            return sources;
        },
        nodeListSelector,
        map
    );

    await page.waitFor(300);
    await page.keyboard.press("Escape");
    return sources;
}

// nodeLists = document.querySelectorAll('div[role="img"]')
//container = Array.from(nodeLists)
//div = container.find(node => node.querySelector('img:first-child'))
//child= div.firstChild
//child.src
