import { chromium, Browser, Page, BrowserContext } from "playwright";
import { createHar, Har } from "playwright-har";

export async function captureHar(
  url: string,
  fetchUrl: string,
  harFilePath: string
): Promise<void> {
  // Launch the browser
  const browser: Browser = await chromium.launch();

  try {
    // Create a new browser context
    const context: BrowserContext = await browser.newContext();

    // Create a HAR file capture
    const har: Har = await createHar(context);

    // Create a new page in the context
    const page: Page = await context.newPage();

    // Perform navigation to the initial URL
    await page.goto(url);

    // Execute a custom fetch request within the page context
    const result = await page.evaluate(async (fetchUrl: string) => {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      return data;
    }, fetchUrl);

    console.log(result); // Process the fetched data

    // Stop HAR capture and save the HAR file
    await har.stop({ path: harFilePath });
  } catch (error) {
    console.error("Error during HAR capture:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}
