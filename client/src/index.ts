const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

const notifyIcon: Element | null = document.querySelector("#status");

const sendReqButton = document.querySelector("#send-button");
sendReqButton?.addEventListener("click", () => {
  fetchData(`${serverUrl}/measure`).then((response) => {
    console.log(response);
  });
  postData(`${serverUrl}/mail`, {
    smallJsonData,
  }).then((response) => {
    console.log(response);
    notifyIcon?.textContent = response.responseData.message;
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

    const responseData = await response.json();

    return { reqStructTime: reqStructEnd - reqStart, responseData };
  } catch (error) {
    console.error(error);
  }
}

const smallJsonData = {
  name: "John Doe",
  email: "john.doe@example.com",
  message: "Hello, world!",
};
