const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

const sendReqButton = document.querySelector("#send-button");
sendReqButton?.addEventListener("click", () => {
  fetchData(`${serverUrl}/measure`).then((response) => {
    console.log(response);
  });
  fetchData(`${serverUrl}/`).then((response) => {
    console.log(response);
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
