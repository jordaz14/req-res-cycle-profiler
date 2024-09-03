import { refreshBodyContent } from "./content.js";

export function initFilter(): any {
  console.log("filter.ts loaded");
}

// TEMPLATE FOR POST PAYLOADS
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

export const filters = {
  region: { status: "useast", us_west: "", us_east: "", asia: "" },
  req_payload: {
    status: "large",
    small: smallJsonData,
    medium: mediumJsonData,
    large: largeJsonData,
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
