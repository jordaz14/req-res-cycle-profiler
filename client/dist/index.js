"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const serverUrl = "http://localhost:3000";
//const serverUrl: string = "https://req-res-lifecycle-viz.onrender.com/";
const notifyIcon = document.querySelector("#status");
const sendReqButton = document.querySelector("#send-button");
sendReqButton === null || sendReqButton === void 0 ? void 0 : sendReqButton.addEventListener("click", () => {
    fetchData(`${serverUrl}/measure`).then((response) => {
        console.log(response);
    });
    postData(`${serverUrl}/mail`, {
        smallJsonData,
    }).then((response) => {
        console.log(response);
        notifyIcon === null || notifyIcon === void 0 ? void 0 : notifyIcon.textContent = response.responseData.message;
    });
});
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const reqStart = Date.now();
        const combinedData = Object.assign(Object.assign({}, data), { reqStart: reqStart });
        try {
            const request = new Request(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(combinedData),
            });
            const reqStructEnd = Date.now();
            const response = yield fetch(request);
            const responseData = yield response.json();
            return { reqStructTime: reqStructEnd - reqStart, responseData };
        }
        catch (error) {
            console.error(error);
        }
    });
}
const smallJsonData = {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "Hello, world!",
};
