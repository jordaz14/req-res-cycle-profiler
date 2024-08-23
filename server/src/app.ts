import express, { Request, Response } from "express";
import cors from "cors";
import { performance } from "perf_hooks";
import * as dns from "dns";
import * as net from "net";
import * as tls from "tls";
import { rejects } from "assert";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

function measureJsonParsingTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsingStart = performance.now();

  express.json()(req, res, () => {
    const parsingEnd = performance.now();
    console.log(`Request parsing time: ${parsingEnd - parsingStart}`);
    req.parsingTime = parsingEnd - parsingStart;
    next();
  });
}

function measureRoutingTime(req: Request, res: Response, next: NextFunction) {
  const routingStart = performance.now();

  res.once("finish", () => {
    const routingEnd = performance.now();
    console.log(`Request routing time: ${routingEnd - routingStart}`);
  });

  next();
}

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is listening on ${port}`);
});
