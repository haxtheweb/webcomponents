/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
importScripts("dist/shim.min.js");
// the full build bundles the codepage tables (cpexcel) and JSZip, and is the
// same SheetJS release the main thread already loads, so the worker reuses it
importScripts("dist/xlsx.full.min.js");
postMessage({ t: "ready" });

onmessage = function (evt) {
  var v;
  try {
    v = XLSX.read(evt.data.d, { type: evt.data.b });
    postMessage({ t: "xlsx", d: JSON.stringify(v) });
  } catch (e) {
    postMessage({ t: "e", d: e.stack || e });
  }
};
