/*
import puppeteer from "puppeteer";
import puppeteerHar from "puppeteer-har"; // Import the puppeteer-har module

export async function generateHar() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const har = new puppeteerHar(page);
  await har.start({ path: "./client/data/result.har" });

  await page.goto("https://main--starlit-parfait-705b1f.netlify.app/");

  await page.evaluate(async () => {
    const response = await fetch("https://req-res-lifecycle-viz.onrender.com/");
    const data = await response.json();
    console.log(data);
  });

  await har.stop();

  await browser.close();
}

generateHar().catch(console.error);
*/