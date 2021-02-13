// only use hmr if development
declare let DEVELOPMENT: boolean;
if (DEVELOPMENT) {
  const { applyPolyfill } = require("custom-elements-hmr-polyfill");
  applyPolyfill();
}

// load out elements
import("./app-root").then(() => {
  if (document.body) {
    document.body.innerHTML = "<app-root></app-root>";
  }
});

export const readerWorker = new Worker("readerWorker.js");
let x = [];
readerWorker.addEventListener("message", (e) => {
  if (e.data === "start") {
    console.time("back");
  }
  if (e.data === "done") {
    console.timeEnd("back");
    console.log("array length:", x.length);
  }
  if (e.data?.length) {
    x = x.concat(e.data);
  }
});
