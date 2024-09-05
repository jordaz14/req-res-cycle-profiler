import { refreshBodyContent } from "./content.js";

export function initFilter(): any {
  console.log("filter.ts loaded");
}

// REQUEST PAYLOADS FILTER
const smallJsonData = {
  id: 1,
  recipientName: "Chris Nolan",
  address: "789 Sunset Blvd",
  city: "Los Angeles",
  state: "CA",
  zipCode: "90028",
};

const mediumJsonData = {
  data: [smallJsonData],
};

const largeJsonData = {
  data: [mediumJsonData],
};

function addJsonData(json: any, loop: any, data: any) {
  for (let i = 0; i < loop; i++) {
    json.data.push(data);
  }
}

addJsonData(mediumJsonData, 10000, smallJsonData);
addJsonData(largeJsonData, 100, mediumJsonData);

const smallJsonDataSize = new Blob([JSON.stringify(smallJsonData)]).size;
const mediumJsonDataSize = new Blob([JSON.stringify(mediumJsonData)]).size;
const largeJsonDataSize = new Blob([JSON.stringify(largeJsonData)]).size;

console.log("data", smallJsonDataSize, mediumJsonDataSize, largeJsonDataSize);

// CLIENT SIDE ALGO COMPLEXITY

const linearTimeAlgo = (arr: number[]): void => {
  for (let i = 0; i < arr.length; i++) {
    let num = i;
  }
};

const quadraticTimeAlgo = (arr: number[]): void => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      let num = i + j;
    }
  }
};

const cubicTimeAlgo = (arr: number[]): void => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      for (let k = 0; k < arr.length; k++) {
        let num = i + j + k;
      }
    }
  }
};

export const filters = {
  req_payload: {
    status: "small",
    small: smallJsonData,
    medium: mediumJsonData,
    large: largeJsonData,
  },
  server_alg: {
    status: "linear",
  },
  sql: {
    status: "low",
  },
  res_payload: {
    status: "small",
  },
  client_alg: {
    status: "linear",
    linear: linearTimeAlgo,
    quadratic: quadraticTimeAlgo,
    cubic: cubicTimeAlgo,
  },
};

const filterButton = document.querySelector("#filter-button") as HTMLElement;

filterButton.addEventListener("click", () => {
  refreshBodyContent("filter");
});

const filterRadioButtons = document.querySelectorAll("input");
filterRadioButtons.forEach((radio) => {
  radio.addEventListener("click", () => {
    let filterGroup = radio.name;
    let filterStatus = radio.value;

    filterGroup = filterGroup.replace("-", "_");

    for (const prop in filters) {
      if (prop == filterGroup) {
        console.log(filterGroup, filterStatus);
        filters[prop].status = filterStatus;
      }
    }
  });
});
