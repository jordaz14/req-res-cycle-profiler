const url: string = "http://localhost:3000";

interface Home {
  message: string;
}

fetchData<Home>(url).then((result) => console.log(result));

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
