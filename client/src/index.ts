import { clientServer } from "./client-server.js";
import { server } from "./server.js";
import { serverClient } from "./server-client.js";
import { client } from "./client.js";

const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

// INITIALIZE ELEMENTS FOR NAV
const navItems: NodeListOf<Element> = document.querySelectorAll(".nav-link");

// INITIALIZE ELEMENTS FOR BODY CONTENT
const clientServerBodyContent = document.querySelector(
  "#client-server-content "
) as HTMLElement;
const serverBodyContent = document.querySelector(
  "#server-content "
) as HTMLElement;
const serverClientBodyContent = document.querySelector(
  "#server-client-content "
) as HTMLElement;
const clientBodyContent = document.querySelector(
  "#client-content "
) as HTMLElement;

// INITIALIZE ELEMENTS FOR LOADING STATUS
const notifyLoading = document.querySelector(
  "#notify-icon > .loader"
) as HTMLElement;
const notifyResponse = document.querySelector(
  "#notify-icon > p"
) as HTMLElement;

// INITIALIZE BUTTON TO SEND REQUESTS
const sendReqButton = document.querySelector("#send-button") as HTMLElement;
const filterButton = document.querySelector("#filter-button") as HTMLElement;

const timeTableBody = document.querySelector(
  "#measurement-table > tbody"
) as HTMLElement;

const measurements = {
  DNS_Resolution: { new: 0, old: 0 },
  TCP_Handshake: { new: 0, old: 0 },
  TLS_Handshake: { new: 0, old: 0 },
  Request_Construction: { new: 0, old: 0 },
  Request_Sending: { new: 0, old: 0 },
  Request_Parsing: { new: 0, old: 0 },
  Middleware_Execution: { new: 0, old: 0 },
  Business_Logic_Execution: { new: 0, old: 0 },
  Database_Query: { new: 0, old: 0 },
  Response_Construction: { new: 0, old: 0 },
  Response_Sending: { new: 0, old: 0 },
  Response_Parsing: { new: 0, old: 0 },
  Scripting: { new: 0, old: 0 },
  Reflow: { new: 0, old: 0 },
  Repaint: { new: 0, old: 0 },
};

// TEMPLATE FOR POST PAYLOADS
const smallJsonData: {} = {
  name: "John Doe",
  email: "john.doe@example.com",
  message: "Hello, world!",
};

sendReqButton?.addEventListener("click", () => {
  // Handles loading status icons
  notifyLoading.style.display = "block";
  notifyResponse.textContent = " ";

  // Posts JSON template to /measure endpoint
  postData(`${serverUrl}/measure`, {
    smallJsonData,
  }).then((response) => {
    // Capture time response was received from return of postData
    const resReceived = response.resReceived;

    // TIME FOR RESPONSE TO REACH CLIENT FROM SERVER
    const resSendingTime = resReceived - response.serverData.resEndTime;

    // TIME FOR JS LOGIC TO EXECUTE
    const scriptingStart = Date.now();

    // Performs heavy computation
    function performHeavyCalculation() {
      for (let i = 0; i < 1e9; i++) {
        let counter = i;
        counter++;
      }
    }

    performHeavyCalculation();
    const scriptingEnd = Date.now();
    const scriptingTime = scriptingEnd - scriptingStart;
    
    // TIME FOR 
    const reflowStart = Date.now();
    notifyLoading.style.display = "none";
    notifyResponse.textContent = response.serverData.message;
    const reflowEnd = Date.now();

    const audio = new Audio();
    audio.src = "./assets/got-mail.mp3";
    audio.volume = 0.3;
    audio.play();

    // TIME FOR JS LOGIC TO EXECUTE
    const scriptingEnd = Date.now();
    const scriptingTime = scriptingEnd - scriptingStart;

    // Appends measurements to measurement object
    measurements.DNS_Resolution.old = measurements.DNS_Resolution.new;
    measurements.TCP_Handshake.old = measurements.TCP_Handshake.new;
    measurements.TLS_Handshake.old = measurements.TLS_Handshake.new;
    measurements.Request_Construction.old =
      measurements.Request_Construction.new;
    measurements.Request_Sending.old = measurements.Request_Sending.new;
    measurements.Request_Parsing.old = measurements.Request_Parsing.new;
    measurements.Middleware_Execution.old =
      measurements.Middleware_Execution.new;
    measurements.Business_Logic_Execution.old =
      measurements.Business_Logic_Execution.new;
    measurements.Database_Query.old = measurements.Database_Query.new;
    measurements.Response_Construction.old =
      measurements.Response_Construction.new;
    measurements.Response_Sending.old = measurements.Response_Sending.new;
    measurements.Response_Parsing.old = measurements.Response_Parsing.new;
    measurements.Scripting.old = measurements.Scripting.new;

    measurements.DNS_Resolution.new = response.serverData.dnsTime;
    measurements.TCP_Handshake.new = response.serverData.tcpTime;
    measurements.TLS_Handshake.new = response.serverData.tlsTime;
    measurements.Request_Construction.new = response.reqConstructionTime;
    measurements.Request_Sending.new =
      response.serverData.reqReceived - response.reqSend;
    measurements.Request_Parsing.new = response.serverData.reqParsingTime;
    measurements.Middleware_Execution.new =
      response.serverData.middleWareExecTime;
    measurements.Business_Logic_Execution.new =
      response.serverData.busLogicTime;
    measurements.Database_Query.new = response.serverData.dbTime;
    measurements.Response_Construction.new = response.serverData.resStructTime;
    measurements.Response_Sending.new = resSendingTime;
    measurements.Response_Parsing.new = response.resParseTime;
    measurements.Scripting.new = scriptingTime;

    console.table(measurements);

    updateColumn(measurements);
  });
});

// ADDS CLICK LISTENER TO EVERY NAV ITEM
function addNavEventListeners(): void {
  for (const item of navItems) {
    item.addEventListener("click", () => {
      refreshBodyContent(item.id);
    });
  }
}

// DNY
function refreshBodyContent(newContent: string | null): void {
  clientServerBodyContent.style.display = "none";
  serverBodyContent.style.display = "none";
  serverClientBodyContent.style.display = "none";
  clientBodyContent.style.display = "none";

  switch (newContent) {
    case "client-server":
      clientServerBodyContent.style.display = "block";
      break;
    case "server":
      serverBodyContent.style.display = "block";
      break;
    case "server-client":
      serverClientBodyContent.style.display = "block";
      break;
    case "client":
      clientBodyContent.style.display = "block";
      break;
  }
}

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

addNavEventListeners();
