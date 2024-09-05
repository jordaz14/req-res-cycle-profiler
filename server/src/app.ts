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

// CONFIGURES SUPABASE DB
const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseURL, supabaseKey);

// HANDLES TIME REQUEST WAS RECEIVED
function measureReqReceivedTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqReceived = Date.now();
  req.receivedTime = reqReceived;
  next();
}

// TIME TO PARSE REQUEST JSON
function measureJSONParseTime(req: Request, res: Response, next: NextFunction) {
  const parsingStart: number = Date.now();

  express.json({ limit: "150mb" })(req, res, () => {
    const parsingEnd: number = Date.now();
    req.parsingTime = parsingEnd - parsingStart;
    next();
  });
}

// EXECUTES MIDDLEWARE
app.use(measureReqReceivedTime);
app.use(measureJSONParseTime);
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the Landing Page." });
});

app.post("/measure", async (req: Request, res: Response) => {
  const hostname = "req-res-server.netlify.app";

  // TIME FOR DNS, TCP, AND TLS CONNECTIONS
  const dnsTime = await measureDnsTime(hostname);
  const tcpTime = await measureTcpTime(hostname, 80);
  const tlsTime = await measureTlsTime(hostname, 443);

  // Capture 'start' of Response
  const resStart = Date.now();

  // Capture start of Request from Request payload
  let { reqStart } = req.body;

  // Capture received time of Request & time to parse Request from middleware
  let { parsingTime, receivedTime } = req;

  // TIME FOR MIDDLEWARE TO EXECUTE (LESS PARSING TIME)
  const middleWareExecTime =
    resStart -
    (receivedTime as number) -
    (parsingTime as number) -
    dnsTime -
    tcpTime -
    tlsTime;

  // TIME FOR BUSINESS LOGIC TO EXECUTE
  const busLogicStart = Date.now();

  // Performs heavy computation
  for (let i = 0; i < 10e8; i++) {
    let counter = i;
    counter++;
  }

  const busLogicEnd = Date.now();
  const busLogicTime = busLogicEnd - busLogicStart;

  // TIME FOR DB TO EXECUTE QUERY
  const dbQueryStart = Date.now();

  const { data, error } = await supabase
    .from("messages")
    .select("message")
    .eq("username", "Bob");

  if (error) {
    console.error(error);
  }

  const dbQueryEnd = Date.now();
  const dbQueryTime: number = dbQueryEnd - dbQueryStart;

  // Capture start of Response Construction
  const resStructStart = Date.now();

  interface ServerData {
    dnsTime: number;
    tcpTime: number;
    tlsTime: number;
    reqParsingTime: number | undefined;
    middleWareExecTime: number;
    busLogicTime: number;
    dbTime: number;
    message: string;
    [key: string]: any;
  }

  const serverData: ServerData = {
    dnsTime: dnsTime,
    tcpTime: tcpTime,
    tlsTime: tlsTime,
    reqReceived: receivedTime,
    reqParsingTime: parsingTime,
    middleWareExecTime: middleWareExecTime,
    busLogicTime: busLogicTime,
    dbTime: dbQueryTime,
    message: "You got mail!",
  };

  // TIME FOR RESPONSE CONSTRUCTION
  const resStructEnd = Date.now();
  const resStructTime = resStructEnd - resStructStart;

  serverData.resStructTime = resStructTime;

  const resEnd = Date.now();

  serverData.resEndTime = resEnd;

  res.send(serverData);
});

// HANDLES TIME TO FIND DNS
function measureDnsTime(hostname: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    dns.lookup(hostname, (err) => {
      if (err) reject(err);
      else resolve(Date.now() - start);
    });
  });
}

// HANDLES TIME TO ESTABLISH TCP HANDSHAKE
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

// HANDLES TIME TO ESTABLISH TLS HANDSHAKE
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
