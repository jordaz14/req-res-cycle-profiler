export function initTable(): any {
  console.log("table.ts loaded");
}

let initialLoad = true;

export const measurements = {
  DNS_Resolution: { new: 0, old: 0 },
  TCP_Handshake: { new: 0, old: 0 },
  TLS_Handshake: { new: 0, old: 0 },
  Request_Construction: { new: 0, old: 0 },
  Request_Sending: { new: 0, old: 0 },
  Request_Parsing: { new: 0, old: 0 },
  Middleware_Execution: { new: 0, old: 0 },
  Business_Logic_Execution: { new: 0, old: 0 },
  Database_Query: { new: 0, old: 0 },
  Response_Construction: { new: 0, old: 0 },
  Response_Sending: { new: 0, old: 0 },
  Response_Parsing: { new: 0, old: 0 },
  Scripting: { new: 0, old: 0 },
  Reflow: { new: 0, old: 0 },
  Repaint: { new: 0, old: 0 },
};

const timeTableBody = document.querySelector(
  "#measurement-table > tbody"
) as HTMLElement;

export function updateColumn(data: any): void {
  timeTableBody.innerHTML = "";

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const row = document.createElement("tr");

      const cellKey = document.createElement("td");
      cellKey.textContent = key.replace(/_/g, " ");
      row.appendChild(cellKey);

      const newCellValue = document.createElement("td");
      newCellValue.textContent = data[key].new;
      newCellValue.className = "data-cell";
      row.appendChild(newCellValue);

      const oldCellValue = document.createElement("td");
      !initialLoad ? (oldCellValue.textContent = data[key].old) : null;
      oldCellValue.className = "data-cell";
      row.appendChild(oldCellValue);

      const deltaCellValue = document.createElement("td");
      !initialLoad
        ? (deltaCellValue.textContent = String(data[key].new - data[key].old))
        : null;
      if (data[key].new > data[key].old && !initialLoad) {
        deltaCellValue.className = "red-cell";
      } else if (data[key].new < data[key].old) {
        deltaCellValue.className = "green-cell";
      } else {
        deltaCellValue.className = "data-cell";
      }
      row.appendChild(deltaCellValue);

      timeTableBody.appendChild(row);
    }
  }

  initialLoad = false;
}

export function updateMeasurements(
  response: any,
  resSendingTime: any,
  scriptingTime: any
): void {
  measurements.DNS_Resolution.old = measurements.DNS_Resolution.new;
  measurements.TCP_Handshake.old = measurements.TCP_Handshake.new;
  measurements.TLS_Handshake.old = measurements.TLS_Handshake.new;
  measurements.Request_Construction.old = measurements.Request_Construction.new;
  measurements.Request_Sending.old = measurements.Request_Sending.new;
  measurements.Request_Parsing.old = measurements.Request_Parsing.new;
  measurements.Middleware_Execution.old = measurements.Middleware_Execution.new;
  measurements.Business_Logic_Execution.old =
    measurements.Business_Logic_Execution.new;
  measurements.Database_Query.old = measurements.Database_Query.new;
  measurements.Response_Construction.old =
    measurements.Response_Construction.new;
  measurements.Response_Sending.old = measurements.Response_Sending.new;
  measurements.Response_Parsing.old = measurements.Response_Parsing.new;
  measurements.Scripting.old = measurements.Scripting.new;

  measurements.DNS_Resolution.new = response.serverData.dnsTime;
  measurements.TCP_Handshake.new = response.serverData.tcpTime;
  measurements.TLS_Handshake.new = response.serverData.tlsTime;
  measurements.Request_Construction.new = response.reqConstructionTime;
  measurements.Request_Sending.new =
    response.serverData.reqReceived - response.reqSend;
  measurements.Request_Parsing.new = response.serverData.reqParsingTime;
  measurements.Middleware_Execution.new =
    response.serverData.middleWareExecTime;
  measurements.Business_Logic_Execution.new = response.serverData.busLogicTime;
  measurements.Database_Query.new = response.serverData.dbTime;
  measurements.Response_Construction.new = response.serverData.resStructTime;
  measurements.Response_Sending.new = resSendingTime;
  measurements.Response_Parsing.new = response.resParseTime;
  measurements.Scripting.new = scriptingTime;
}
