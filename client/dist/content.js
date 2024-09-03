export function initContent() {
    console.log("content.ts loaded");
}
// INITIALIZE ELEMENTS FOR NAV
const navItems = document.querySelectorAll(".nav-link");
// INITIALIZE ELEMENTS FOR BODY CONTENT
const inputCard = document.querySelector("#input-card-body");
const clientServerBodyContent = document.querySelector("#client-server-content ");
const serverBodyContent = document.querySelector("#server-content ");
const serverClientBodyContent = document.querySelector("#server-client-content ");
const clientBodyContent = document.querySelector("#client-content ");
const filterBodyContent = document.querySelector("#filter-content");
// ADDS CLICK LISTENER TO EVERY NAV ITEM
function addNavEventListeners() {
    for (const item of navItems) {
        item.addEventListener("click", () => {
            refreshBodyContent(item.id);
        });
    }
}
refreshBodyContent("client-server");
// DYNAMICALLY CHANGE BODY CONTENT
export function refreshBodyContent(newContent) {
    inputCard.style.backgroundColor = "white";
    clientServerBodyContent.style.display = "none";
    serverBodyContent.style.display = "none";
    serverClientBodyContent.style.display = "none";
    clientBodyContent.style.display = "none";
    filterBodyContent.style.display = "none";
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
        case "filter":
            inputCard.style.backgroundColor = "#4b4b4b";
            filterBodyContent.style.display = "block";
    }
}
addNavEventListeners();
