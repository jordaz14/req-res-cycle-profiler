"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.port || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    const requestTime = Date.now();
    const formattedRequestTime = new Date(requestTime).toISOString();
    const LOOP_COUNT = 1e9;
    for (let i = 0; i < LOOP_COUNT; i++) {
        let j = 0;
    }
    const responseTime = Date.now();
    const formattedResponseTime = new Date(responseTime).toISOString();
    res.send({ reqTime: formattedRequestTime, resTime: formattedResponseTime });
});
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
