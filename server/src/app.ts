import express, { Request, Response } from "express";
import { generateHar } from "./generateHar";
import cors from "cors";
import { error } from "console";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/generate-har", async (req: Request, res: Response) => {
  try {
    const harData = await generateHar();
    console.log(harData);
    res.status(200).send({ message: "hi there" });
  } catch (error) {
    console.error("An error occurred.");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "hello world" });
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
