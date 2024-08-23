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
app.post("/mail", measureJsonParsingTime, measureRoutingTime, (req, res) => {
    let { reqStart } = req.body;
    let { parsingTime } = req;
    console.log(reqStart, parsingTime);
    res.send({ parsingTime: parsingTime, message: "You got mail" });
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
function measureJsonParsingTime(req, res, next) {
    const parsingStart = perf_hooks_1.performance.now();
    express_1.default.json()(req, res, () => {
        const parsingEnd = perf_hooks_1.performance.now();
        console.log(`Request parsing time: ${parsingEnd - parsingStart}`);
        req.parsingTime = parsingEnd - parsingStart;
        next();
    });
}
function measureRoutingTime(req, res, next) {
    const routingStart = perf_hooks_1.performance.now();
    res.once("finish", () => {
        const routingEnd = perf_hooks_1.performance.now();
        console.log(`Request routing time: ${routingEnd - routingStart}`);
    });
    next();
}
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server is listening on ${port}`);
});
