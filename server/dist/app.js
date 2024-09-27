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
    express_1.default.json({ limit: "150mb" })(req, res, () => {
        const parsingEnd = Date.now();
        req.parsingTime = parsingEnd - parsingStart;
        next();
    });
}
const corsOptions = {
    origin: "https://req-res-cycle-profiler.onrender.com/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
// EXECUTES MIDDLEWARE
app.use((0, cors_1.default)(corsOptions));
app.use(measureReqReceivedTime);
app.use(measureJSONParseTime);
app.get("/", (req, res) => {
    res.send({ message: "Welcome to the Landing Page." });
});
app.post("/measure", async (req, res) => {
    const hostname = "req-res-cycle-profiler-production.up.railway.app";
    // TIME FOR DNS, TCP, AND TLS CONNECTIONS
    const dnsTime = await measureDnsTime(hostname);
    const tcpTime = await measureTcpTime(hostname, 80);
    const tlsTime = await measureTlsTime(hostname, 443);
    // Capture 'start' of Response
    const resStart = Date.now();
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
    // Update filters for subsequent computations
    filters.server_alg.status = req.body.reqPayload.server_alg;
    filters.sql.status = req.body.reqPayload.sql;
    filters.res_payload.status = req.body.reqPayload.res_payload;
    let busLogicFunc;
    const arr = Array(2000).fill(0);
    switch (filters.server_alg.status) {
        case "linear":
            busLogicFunc = filters.server_alg.linear;
            break;
        case "quadratic":
            busLogicFunc = filters.server_alg.quadratic;
            break;
        case "cubic":
            busLogicFunc = filters.server_alg.cubic;
            break;
    }
    busLogicFunc?.(arr);
    const busLogicEnd = Date.now();
    const busLogicTime = busLogicEnd - busLogicStart;
    // TIME FOR DB TO EXECUTE QUERY
    const dbQueryStart = Date.now();
    switch (filters.sql.status) {
        case "low":
            let { data: lowData, error: lowError } = await supabase
                .from("example")
                .select("*")
                .eq("id", "10000");
            console.log(lowData);
            console.log("low exec");
            if (lowError) {
                console.error(lowError);
            }
            break;
        case "high":
            let { data: highData, error: highError } = await supabase
                .from("example")
                .select("*")
                .eq("class", "foo");
            console.log(highData);
            console.log("high exec");
            if (highError) {
                console.error(highError);
            }
            break;
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
    switch (filters.res_payload.status) {
        case "small":
            serverData.simulatedData = filters.res_payload.small;
            break;
        case "medium":
            serverData.simulatedData = filters.res_payload.medium;
            break;
        case "large":
            serverData.simulatedData = filters.res_payload.large;
            break;
    }
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
// REQUEST PAYLOADS FILTER
const smallJsonData = {
    id: 1,
    recipientName: "Chris Nolan",
    address: "789 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
};
const mediumJsonData = {
    data: [smallJsonData],
};
const largeJsonData = {
    data: [mediumJsonData],
};
function addJsonData(json, loop, data) {
    for (let i = 0; i < loop; i++) {
        json.data.push(data);
    }
}
addJsonData(mediumJsonData, 10000, smallJsonData);
addJsonData(largeJsonData, 100, mediumJsonData);
// SERVER SIDE ALGO COMPLEXITY
const linearTimeAlgo = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let num = i;
    }
};
const quadraticTimeAlgo = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            let num = i + j;
        }
    }
};
const cubicTimeAlgo = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr.length; k++) {
                let num = i + j + k;
            }
        }
    }
};
const filters = {
    server_alg: {
        status: "linear",
        linear: linearTimeAlgo,
        quadratic: quadraticTimeAlgo,
        cubic: cubicTimeAlgo,
    },
    sql: { status: "low" },
    res_payload: {
        status: "small",
        small: smallJsonData,
        medium: mediumJsonData,
        large: largeJsonData,
    },
};
app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server is listening on ${port}`);
});
