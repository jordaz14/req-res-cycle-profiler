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

app.get("/measure", async (req: Request, res: Response) => {
  const hostname = "req-res-lifecycle-viz.onrender.com";
  try {
    const dnsTime = await measureDnsTime(hostname);
    const tcpTime = await measureTcpTime(hostname, 80);
    const tlsTime = await measureTlsTime(hostname, 443);

    res.json({ dnsTime, tcpTime, tlsTime });
  } catch (err) {
    console.error(err);
  }
});

/*
app.get("/generate-har", async (req: Request, res: Response) => {
  try {
    const harData = await generateHar();
    console.log(harData);
    res.status(200).send({ message: "hi there" });
  } catch (error) {
    console.error("An error occurred.");
  }
});
*/

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "hello world" });
});

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server is listening on ${port}`);
});
