import { clientServer } from "./client-server.js";
import { server } from "./server.js";
import { serverClient } from "./server-client.js";
import { client } from "./client.js";

const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

const times: {} = {
  dns: undefined,
  tcp: undefined,
  tls: undefined,
};

const notifyLoading = document.querySelector(
  "#notify-icon > .loader"
) as HTMLElement;
const notifyResponse = document.querySelector(
  "#notify-icon > p"
) as HTMLElement;

const sendReqButton = document.querySelector("#send-button");
sendReqButton?.addEventListener("click", () => {
  notifyLoading.style.display = "block";
  notifyResponse.textContent = " ";
  fetchData(`${serverUrl}/measure`).then((response) => {
    console.log(response);
  });
  postData(`${serverUrl}/mail`, {
    smallJsonData,
  }).then((response) => {
    const resReceived = Date.now();
    const resSendingTime = resReceived - response.responseData.resEndTime;
    console.log(response);

    const scriptingStart = Date.now();
    function performHeavyCalculation() {
      for (let i = 0; i < 1e9; i++) {
        let counter = i;
        counter++;
      }
    }

    performHeavyCalculation();
    const scriptingEnd = Date.now();
    const scriptingTime = scriptingEnd - scriptingStart;
    console.log(scriptingTime);

    const reflowStart = Date.now();
    notifyLoading.style.display = "none";
    notifyResponse.textContent = response.responseData.message;
    const reflowEnd = Date.now();

    const audio = new Audio();
    audio.src = "./assets/got-mail.mp3";
    audio.volume = 0.3;
    audio.play();
  });
});

async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    return response.json() as T;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function postData(url: string, data: {}): Promise<any> {
  const reqStart = Date.now();

  const combinedData = {
    ...data,
    reqStart: reqStart,
  };

  try {
    const request = new Request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(combinedData),
    });

    const reqStructEnd = Date.now();

    const response = await fetch(request);

    const resParseStart = Date.now();

    const responseData = await response.json();

    const resParseEnd = Date.now();

    return {
      reqStructTime: reqStructEnd - reqStart,
      resParseTime: resParseEnd - resParseStart,
      responseData,
    };
  } catch (error) {
    console.error(error);
  }
}

const smallJsonData: {} = {
  name: "John Doe",
  email: "john.doe@example.com",
  message: "Hello, world!",
};

const bodyContent = document.querySelector("#input-card-body") as Element;

const navItems: NodeListOf<Element> = document.querySelectorAll(".nav-link");

function addNavEventListeners(): void {
  for (const item of navItems) {
    item.addEventListener("click", () => {
      refreshBodyContent(item.id);
    });
  }
}

addNavEventListeners();

refreshBodyContent("client-server");

function refreshBodyContent(newContent: string | null): void {
  bodyContent.innerHTML = "";

  switch (newContent) {
    case "client-server":
      for (const el in clientServer) {
        const elType: string = el.split("_")[0];
        window[elType] = document.createElement(elType);
        window[elType].textContent = clientServer[el];
        bodyContent.appendChild(window[elType]);
      }
      break;
    case "server":
      for (const el in server) {
        const elType = el.split("_")[0];
        window[elType] = document.createElement(elType);
        window[elType].textContent = server[el];
        bodyContent.appendChild(window[elType]);
      }
      break;
    case "server-client":
      for (const el in serverClient) {
        const elType = el.split("_")[0];
        window[elType] = document.createElement(elType);
        window[elType].textContent = serverClient[el];
        bodyContent.appendChild(window[elType]);
      }
      break;
    case "client":
      for (const el in client) {
        const elType = el.split("_")[0];
        window[elType] = document.createElement(elType);
        window[elType].textContent = client[el];
        bodyContent.appendChild(window[elType]);
      }
      break;
  }
}
