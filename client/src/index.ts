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
const sendReqButton = document.querySelector("#send-button");

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
    const reqStructEnd = Date.now();
    const reqStructTime = reqStructEnd - reqStart;

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
      reqStructTime: reqStructTime,
      reqSendTime: 0,
      resReceived: resReceived,
      resParseTime: resParseTime,
      serverData,
    };
  } catch (error) {
    console.error(error);
  }
}

addNavEventListeners();
