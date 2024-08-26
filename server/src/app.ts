import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { performance } from "perf_hooks";
import * as dns from "dns";
import * as net from "net";
import * as tls from "tls";
import { json } from "stream/consumers";

const app = express();
const port = process.env.PORT || 3000;

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
  console.log(reqStart, resStart);
  const middlewareExecTime = resStart - reqStart - (parsingTime as number);
  console.log(middlewareExecTime);
  res.send({
    parsingTime: parsingTime,
    message: "You got mail!",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the Landing Page." });
});

function measureDnsTime(hostname: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    dns.lookup(hostname, (err) => {
      if (err) reject(err);
      else resolve(performance.now() - start);
    });
  });
}

function measureTcpTime(hostname: string, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const socket = net.createConnection(port, hostname);
    socket.on("connect", () => {
      socket.end();
      resolve(performance.now() - start);
    });
    socket.on("error", reject);
  });
}

function measureTlsTime(hostname: string, port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const socket = tls.connect(port, hostname, {}, () => {
      socket.end();
      resolve(performance.now() - start);
    });
    socket.on("error", reject);
  });
}

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is listening on ${port}`);
});
