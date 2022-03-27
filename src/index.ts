import "dotenv/config";
import { Scraper } from "./scrap";

(async () => {
    const driveUrl: string = String(process.env["drive_url"]);
    const scraper = new Scraper(driveUrl);
    await scraper.scrap();
})();
