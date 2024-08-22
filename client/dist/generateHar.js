var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import puppeteerHar from "puppeteer-har"; // Import the puppeteer-har module
export function generateHar() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        const har = new puppeteerHar(page);
        yield har.start({ path: "./client/data/result.har" });
        yield page.goto("https://main--starlit-parfait-705b1f.netlify.app/");
        yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("https://req-res-lifecycle-viz.onrender.com/");
            const data = yield response.json();
            console.log(data);
        }));
        yield har.stop();
        yield browser.close();
    });
}
generateHar().catch(console.error);
