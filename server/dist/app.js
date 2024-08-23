"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generateHar_1 = require("./generateHar");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/generate-har", async (req, res) => {
    try {
        const harData = await (0, generateHar_1.generateHar)();
        console.log(harData);
        res.status(200).send({ message: "hi there" });
    }
    catch (error) {
        console.error("An error occurred.");
    }
});
/*

app.get("/", async (req: Request, res: Response) => {
  try {
    const requestTime: number = Date.now();
    const formattedRequestTime: string = new Date(requestTime).toISOString();

    const LOOP_COUNT: number = 1e6;

    for (let i = 0; i < LOOP_COUNT; i++) {
      let j = 0;
    }

    const responseTime: number = Date.now();
    const formattedResponseTime: string = new Date(responseTime).toISOString();
    res.send({
      reqTime: formattedRequestTime,
      resTime: formattedResponseTime,
    });
  } catch (error) {
    console.error(error);
    res.send("An error occurred");
  }
});

*/
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server is listening on ${port}`);
});
