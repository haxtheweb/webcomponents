import { expect } from "@open-wc/testing";

// Runs the real vendored worker (lib/xlsx/xlsxworker.js) end to end, so a
// broken importScripts path or a SheetJS build that fails inside a worker
// scope shows up here instead of only on a live spreadsheet import.
const workerUrl = new URL("../lib/xlsx/xlsxworker.js", import.meta.url).href;

function readInWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl);
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error("xlsx worker did not reply"));
    }, 8000);
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      reject(new Error(e.message || "xlsx worker failed to load"));
    };
    worker.onmessage = (e) => {
      if (e.data.t === "ready") {
        return;
      }
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.postMessage({ d: data, b: "binary" });
  });
}

describe("xlsxworker (real worker)", () => {
  it("loads SheetJS and parses a workbook", async () => {
    const reply = await readInWorker("name,score\nada,10\ngrace,12");
    expect(reply.t).to.equal("xlsx");
    const wb = JSON.parse(reply.d);
    expect(wb.SheetNames).to.have.length(1);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    expect(sheet.A1.v).to.equal("name");
    expect(sheet.B3.v).to.equal(12);
  });
});
