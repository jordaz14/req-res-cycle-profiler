import puppeteer from "puppeteer";
import puppeteerHar from "puppeteer-har"; // Import the puppeteer-har module
import fs from "fs";
import path from "path";

export async function generateHar() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const har = new puppeteerHar(page);
  const harFilePath = path.resolve(__dirname, "..", "data", "result.har");
  await har.start({ path: harFilePath });

  await page.goto("https://main--starlit-parfait-705b1f.netlify.app/");

  await page.evaluate(async () => {
    const response = await fetch("https://req-res-lifecycle-viz.onrender.com/");
    const data = await response.json();
    console.log(data);
  });

  await har.stop();

  await browser.close();

  const harFileContent = fs.readFileSync(harFilePath, "utf8");

  let harData = JSON.parse(harFileContent);

  return harData.log.version;
}
