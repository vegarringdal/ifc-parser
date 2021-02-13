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

let keep: any = [];

readerWorker.addEventListener("message", (e) => {
  if (e.data === "start") {
    keep = [];
    console.time("back, this is total time..");
  }
  if (e.data === "done") {
    console.timeEnd("back, this is total time..");
    keep.forEach((e) => {
      console.log(e);
    });
  }
  if (Array.isArray(e.data)) {
    e.data.forEach((r: any) => {
      if (
        r[1] === "IFCPROJECT" ||
        r[1] === "IFCSITE" ||
        r[1] === "IFCBUILDING" ||
        r[1] === "IFCBUILDINGSTORY" ||
        r[1] === "IFCSPACES"
      ) {
        keep.push(r);
      }
    });
  }
});
