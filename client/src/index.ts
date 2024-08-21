// const serverUrl: string = "http://localhost:3000/";
const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com";

// MEASURES DNS RESOLUTION TIME
async function measureNetworkTiming(url: string): Promise<{} | null> {
  performance.clearResourceTimings();

  await fetchData(url);

  const entries: PerformanceResourceTiming[] = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];

  const entry = entries.find((entry) => entry.name === url);

  if (entry) {
    const dnsTime: number = entry.domainLookupEnd - entry.domainLookupStart;
    const tcpTime: number = entry.connectEnd - entry.connectStart;
    const tlsTime: number = entry.secureConnectionStart
      ? entry.connectEnd - entry.secureConnectionStart
      : 0;
    return { dnsTime, tcpTime, tlsTime };
  } else {
    return null;
  }
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
