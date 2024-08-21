"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const serverUrl: string = "http://localhost:3000/";
const serverUrl = "https://req-res-lifecycle-viz.onrender.com";
// MEASURES DNS RESOLUTION TIME
function measureNetworkTiming(url) {
    return __awaiter(this, void 0, void 0, function* () {
        performance.clearResourceTimings();
        yield fetchData(url);
        const entries = performance.getEntriesByType("resource");
        const entry = entries.find((entry) => entry.name === url);
        if (entry) {
            const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
            const tcpTime = entry.connectEnd - entry.connectStart;
            const tlsTime = entry.secureConnectionStart
                ? entry.connectEnd - entry.secureConnectionStart
                : 0;
            return { dnsTime, tcpTime, tlsTime };
        }
        else {
            return null;
        }
    });
}
measureNetworkTiming(serverUrl).then((result) => {
    console.log(result);
});
/*
interface Home {
  message: string;
}

fetchData<Home>(serverUrl).then((result) => console.log(result));
*/
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
