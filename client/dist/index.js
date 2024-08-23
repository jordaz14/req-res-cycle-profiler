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
const serverUrl = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";
const sendReqButton = document.querySelector("#send-button");
sendReqButton === null || sendReqButton === void 0 ? void 0 : sendReqButton.addEventListener("click", () => {
    fetchData(`${serverUrl}/generate-har`).then((response) => {
        console.log(response);
    });
});
/*
// MEASURES DNS RESOLUTION TIME
async function measureNetworkTiming(url: string): Promise<{} | null> {
  console.log("Network timing...");
  performance.clearResourceTimings();

  await fetchData(url);

  const entries: PerformanceResourceTiming[] = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];

  console.log(entries);

  const entry = entries.find((entry) => entry.name === url);

  if (entry) {
    const dnsTime: number = entry.domainLookupEnd - entry.domainLookupStart;
    const tcpTime: number = entry.connectEnd - entry.connectStart;
    const tlsTime: number = entry.secureConnectionStart
      ? entry.connectEnd - entry.secureConnectionStart
      : 0;
    return { dnsTime, tcpTime, tlsTime };
  } else {
    console.log("No entry found.");
    return null;
  }
}


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
