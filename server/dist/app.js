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
const dns = __importStar(require("dns"));
const net = __importStar(require("net"));
const tls = __importStar(require("tls"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// CONFIGURES SUPABASE DB
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseURL, supabaseKey);
// HANDLES TIME REQUEST WAS RECEIVED
function measureReqReceivedTime(req, res, next) {
    const reqReceived = Date.now();
    req.receivedTime = reqReceived;
    next();
}
// TIME TO PARSE REQUEST JSON
function measureJSONParseTime(req, res, next) {
    const parsingStart = Date.now();
    express_1.default.json()(req, res, () => {
        const parsingEnd = Date.now();
        req.parsingTime = parsingEnd - parsingStart;
        next();
    });
}
// EXECUTES MIDDLEWARE
app.use(measureReqReceivedTime);
app.use(measureJSONParseTime);
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send({ message: "Welcome to the Landing Page." });
});
app.post("/measure", async (req, res) => {
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
    const middleWareExecTime = resStart -
        receivedTime -
        parsingTime -
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
    const dbQueryTime = dbQueryEnd - dbQueryStart;
    // Capture start of Response Construction
    const resStructStart = Date.now();
    const serverData = {
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
function measureDnsTime(hostname) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        dns.lookup(hostname, (err) => {
            if (err)
                reject(err);
            else
                resolve(Date.now() - start);
        });
    });
}
// HANDLES TIME TO ESTABLISH TCP HANDSHAKE
function measureTcpTime(hostname, port) {
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
function measureTlsTime(hostname, port) {
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
