import express, { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
import { performance } from "perf_hooks";
import * as dns from "dns";
import * as net from "net";
import * as tls from "tls";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// DB CONFIGURATION
const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseURL, supabaseKey);

function measureReqReceivalTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqReceived = Date.now();
  req.receivedTime = reqReceived;
  next();
}

app.use(measureReqReceivalTime);
app.use(cors());

function measureJsonParsingTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsingStart = performance.now();

  express.json()(req, res, () => {
    const parsingEnd = performance.now();
    req.parsingTime = parsingEnd - parsingStart;
    next();
  });
}

app.use(measureJsonParsingTime);

// MEASURES DNS, TCP, & TLS CONNECTION TIMES
app.get("/measure", express.json(), async (req: Request, res: Response) => {
  const hostname = "req-res-server.netlify.app";
  try {
    const dnsTime = await measureDnsTime(hostname);
    const tcpTime = await measureTcpTime(hostname, 80);
    const tlsTime = await measureTlsTime(hostname, 443);

    res.json({ dnsTime, tcpTime, tlsTime });
  } catch (err) {
    console.error(err);
  }
});

app.post("/mail", (req: Request, res: Response) => {
  const resStart = Date.now();
  let { reqStart } = req.body;
  let { parsingTime } = req;
  // This can also be considered all other middleware executions
  const routingTime = resStart - reqStart - (parsingTime as number);

  // BUSINESS LOGIC
  const logicStart = performance.now();
  const LOOPS = 10e8;
  for (let i = 0; i < LOOPS; i++) {
    let counter = i;
    counter++;
  }
  const logicEnd = performance.now();
  const logicTime = logicEnd - logicStart;

  // DB QUERY TIME
  const dbQueryStart = performance.now();

  const { data, error } = await supabase
    .from("messages")
    .select("message")
    .eq("username", "Bob");

  if (error) {
    console.error(error);
  }

  console.log(data);

  const dbQueryEnd = performance.now();
  const dbQueryTime: number = dbQueryEnd - dbQueryStart;

  const resStructStart = performance.now();

  interface Payload {
    reqSendingTime: number;
    reqParsingTime: number | undefined;
    middleWareExecTime: number;
    logicTime: number;
    dbTime: number;
    message: string;
    [key: string]: any;
  }

  const payload: Payload = {
    reqSendingTime: requestSendingTime,
    reqParsingTime: parsingTime,
    routingTime: routingTime,
    logicTime: logicTime,
    message: "You got mail!",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the Landing Page." });
});

function measureDnsTime(hostname: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    dns.lookup(hostname, (err) => {
      if (err) reject(err);
      else resolve(Date.now() - start);
    });
  });
}

function measureTcpTime(hostname: string, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const socket = net.createConnection(port, hostname);
    socket.on("connect", () => {
      socket.end();
      resolve(Date.now() - start);
    });
    socket.on("error", reject);
  });
}

function measureTlsTime(hostname: string, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const socket = tls.connect(port, hostname, {}, () => {
      socket.end();
      resolve(Date.now() - start);
    });
    socket.on("error", reject);
  });
}

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is listening on ${port}`);
});
