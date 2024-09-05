import { initContent } from "./content.js";
import { initFilter, filters } from "./filter.js";
import {
  initTable,
  updateMeasurements,
  updateColumn,
  measurements,
} from "./table.js";

initContent();
initFilter();
initTable();

const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

// INITIALIZE ELEMENTS FOR LOADING STATUS
const notifyLoading = document.querySelector(
  "#notify-icon > .loader"
) as HTMLElement;
const notifyResponse = document.querySelector(
  "#notify-icon > p"
) as HTMLElement;

// INITIALIZE BUTTON TO SEND REQUESTS
const sendReqButton = document.querySelector("#send-button") as HTMLElement;

sendReqButton?.addEventListener("click", () => {
  // Handles loading status icons
  notifyLoading.style.display = "block";
  notifyResponse.textContent = " ";

  let reqPayload = {
    server_alg: filters.server_alg.status,
    sql: filters.sql.status,
    res_payload: filters.res_payload.status,
    simulatedData: {},
  };

  switch (filters.req_payload.status) {
    case "small":
      reqPayload.simulatedData = filters.req_payload.small;
      break;
    case "medium":
      reqPayload.simulatedData = filters.req_payload.medium;
      break;
    case "large":
      reqPayload.simulatedData = filters.req_payload.large;
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

    let scriptingFunc;
    const arr = Array(2000).fill(0);

    switch (filters.client_alg.status) {
      case "linear":
        scriptingFunc = filters.client_alg.linear;
        break;
      case "quadratic":
        scriptingFunc = filters.client_alg.quadratic;
        break;
      case "cubic":
        scriptingFunc = filters.client_alg.cubic;
        break;
    }

    scriptingFunc?.(arr);

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
async function postData(url: string, data: {}): Promise<any> {
  // Capture start of Request
  const reqStart = Date.now();

  // Combine start of Request with data passed as argument
  const combinedData = {
    ...data,
    reqStart: reqStart,
  };

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
    const response = await fetch(request);

    // Capture time when Response was received
    const resReceived = Date.now();

    // Parse Response to JSON
    const serverData = await response.json();

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
  } catch (error) {
    console.error(error);
  }
}
