"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const perf_hooks_1 = require("perf_hooks");
const dns = __importStar(require("dns"));
const net = __importStar(require("net"));
const tls = __importStar(require("tls"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// DB CONFIGURATION
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseURL, supabaseKey);
function measureReqReceivalTime(req, res, next) {
    const reqReceived = Date.now();
    req.receivedTime = reqReceived;
    next();
}
app.use(measureReqReceivalTime);
app.use((0, cors_1.default)());
function measureJsonParsingTime(req, res, next) {
    const parsingStart = perf_hooks_1.performance.now();
    express_1.default.json()(req, res, () => {
        const parsingEnd = perf_hooks_1.performance.now();
        req.parsingTime = parsingEnd - parsingStart;
        next();
    });
}
app.use(measureJsonParsingTime);
// MEASURES DNS, TCP, & TLS CONNECTION TIMES
app.get("/measure", express_1.default.json(), async (req, res) => {
    const hostname = "req-res-server.netlify.app";
    try {
        const dnsTime = await measureDnsTime(hostname);
        const tcpTime = await measureTcpTime(hostname, 80);
        const tlsTime = await measureTlsTime(hostname, 443);
        res.json({ dnsTime, tcpTime, tlsTime });
    }
    catch (err) {
        console.error(err);
    }
});
app.post("/mail", (req, res) => {
    const resStart = Date.now();
    let { reqStart } = req.body;
    let { parsingTime } = req;
    // This can also be considered all other middleware executions
    const routingTime = resStart - reqStart - parsingTime;
    // BUSINESS LOGIC
    const logicStart = perf_hooks_1.performance.now();
    const LOOPS = 10e8;
    for (let i = 0; i < LOOPS; i++) {
        let counter = i;
        counter++;
    }
    const logicEnd = perf_hooks_1.performance.now();
    const logicTime = logicEnd - logicStart;
    // DB QUERY TIME
    const dbQueryStart = perf_hooks_1.performance.now();
    const { data, error } = await supabase
        .from("messages")
        .select("message")
        .eq("username", "Bob");
    if (error) {
        console.error(error);
    }
    console.log(data);
    const dbQueryEnd = perf_hooks_1.performance.now();
    const dbQueryTime = dbQueryEnd - dbQueryStart;
    const resStructStart = perf_hooks_1.performance.now();
    const payload = {
        reqSendingTime: requestSendingTime,
        reqParsingTime: parsingTime,
        routingTime: routingTime,
        logicTime: logicTime,
        message: "You got mail!",
    });
});
app.get("/", (req, res) => {
    res.send({ message: "Welcome to the Landing Page." });
});
function measureDnsTime(hostname) {
    return new Promise((resolve, reject) => {
        const start = perf_hooks_1.performance.now();
        dns.lookup(hostname, (err) => {
            if (err)
                reject(err);
            else
                resolve(perf_hooks_1.performance.now() - start);
        });
    });
}
function measureTcpTime(hostname, port) {
    return new Promise((resolve, reject) => {
        const start = perf_hooks_1.performance.now();
        const socket = net.createConnection(port, hostname);
        socket.on("connect", () => {
            socket.end();
            resolve(perf_hooks_1.performance.now() - start);
        });
        socket.on("error", reject);
    });
}
function measureTlsTime(hostname, port) {
    return new Promise((resolve, reject) => {
        const start = perf_hooks_1.performance.now();
        const socket = tls.connect(port, hostname, {}, () => {
            socket.end();
            resolve(perf_hooks_1.performance.now() - start);
        });
        socket.on("error", reject);
    });
}
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server is listening on ${port}`);
});
