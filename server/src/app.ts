import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  const requestTime: number = Date.now();
  const formattedRequestTime: string = new Date(requestTime).toISOString();

  const LOOP_COUNT: number = 1e9;

  for (let i = 0; i < LOOP_COUNT; i++) {
    let j = 0;
  }

  const responseTime: number = Date.now();
  const formattedResponseTime: string = new Date(responseTime).toISOString();
  res.send({ reqTime: formattedRequestTime, resTime: formattedResponseTime });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
