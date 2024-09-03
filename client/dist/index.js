var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initContent } from "./content.js";
import { initFilter, filters } from "./filter.js";
import { initTable, updateMeasurements, updateColumn, measurements, } from "./table.js";
initContent();
initFilter();
initTable();
const serverUrl = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";
// INITIALIZE ELEMENTS FOR LOADING STATUS
const notifyLoading = document.querySelector("#notify-icon > .loader");
const notifyResponse = document.querySelector("#notify-icon > p");
// INITIALIZE BUTTON TO SEND REQUESTS
const sendReqButton = document.querySelector("#send-button");
sendReqButton === null || sendReqButton === void 0 ? void 0 : sendReqButton.addEventListener("click", () => {
    // Handles loading status icons
    notifyLoading.style.display = "block";
    notifyResponse.textContent = " ";
    let reqPayload = {};
    switch (filters.req_payload.status) {
        case "small":
            console.log("sm");
            reqPayload = filters.req_payload.small;
            break;
        case "medium":
            console.log("md");
            reqPayload = filters.req_payload.medium;
            break;
        case "large":
            console.log("lg");
            reqPayload = filters.req_payload.large;
            break;
    }
    console.log(reqPayload);
    // Posts JSON template to /measure endpoint
    postData(`${serverUrl}/measure`, {
        reqPayload,
    }).then((response) => {
        // Capture time response was received from return of postData
        const resReceived = response.resReceived;
        // TIME FOR RESPONSE TO REACH CLIENT FROM SERVER
        const resSendingTime = resReceived - response.serverData.resEndTime;
        // Capture time scripting logic begins
        const scriptingStart = Date.now();
        // Performs heavy computation in scripting logic
        function performHeavyCalculation() {
            for (let i = 0; i < 1e9; i++) {
                let counter = i;
                counter++;
            }
        }
        performHeavyCalculation();
        // Misc. scripting logic for notification status
        notifyLoading.style.display = "none";
        notifyResponse.textContent = response.serverData.message;
        const audio = new Audio();
        audio.src = "./assets/got-mail.mp3";
        audio.volume = 0.3;
        audio.play();
        // TIME FOR JS LOGIC TO EXECUTE
        const scriptingEnd = Date.now();
        const scriptingTime = scriptingEnd - scriptingStart;
        // Appends measurements to measurement object
        updateMeasurements(response, resSendingTime, scriptingTime);
        console.table(measurements);
        updateColumn(measurements);
    });
});
// HANDLES POST REQUESTS WITH TIME CAPTURES
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Capture start of Request
        const reqStart = Date.now();
        // Combine start of Request with data passed as argument
        const combinedData = Object.assign(Object.assign({}, data), { reqStart: reqStart });
        try {
            // Construct Request with combined data
            const request = new Request(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(combinedData),
            });
            // Capture end of Request construction
            const reqConstructionEnd = Date.now();
            const reqConstructionTime = reqConstructionEnd - reqStart;
            // Capture time when Request was sent
            const reqSend = Date.now();
            // POST Data to endpoint
            const response = yield fetch(request);
            // Capture time when Response was received
            const resReceived = Date.now();
            // Parse Response to JSON
            const serverData = yield response.json();
            // Capture end of Response parsing
            const resParseEnd = Date.now();
            const resParseTime = resParseEnd - resReceived;
            // Return request structuring time, response parsing time, and response payload
            return {
                reqConstructionTime: reqConstructionTime,
                reqSend: reqSend,
                resReceived: resReceived,
                resParseTime: resParseTime,
                serverData,
            };
        }
        catch (error) {
            console.error(error);
        }
    });
}
