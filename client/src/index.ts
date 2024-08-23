const serverUrl: string = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";

const sendReqButton = document.querySelector("#send-button");
sendReqButton?.addEventListener("click", () => {
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
