"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHar = generateHar;
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_har_1 = __importDefault(require("puppeteer-har")); // Import the puppeteer-har module
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function generateHar() {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    const har = new puppeteer_har_1.default(page);
    const harFilePath = path_1.default.resolve(__dirname, "..", "data", "result.har");
    await har.start({ path: harFilePath });
    await page.goto("https://main--starlit-parfait-705b1f.netlify.app/");
    await page.evaluate(async () => {
        const response = await fetch("https://req-res-lifecycle-viz.onrender.com/");
        const data = await response.json();
        console.log(data);
    });
    await har.stop();
    await browser.close();
    const harFileContent = fs_1.default.readFileSync(harFilePath, "utf8");
    let harData = JSON.parse(harFileContent);
    return harData.log.version;
}
