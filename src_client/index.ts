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
  /*
  I send back parsed data evry 25 k rows
  maybe I should send this to new worker?

  I should build up map so we know what each item of array is
  first is always ID then NAME
  but rest we need a map for.
  then we can wrap it in a js proxy to save memeory
  make json will kill unit using IFC.js

  */

  if (e.data === "start") {
    keep = [];
    console.time("back, this is total time..");
  }
  if (e.data === "done") {
    console.timeEnd("back, this is total time..");
    keep.forEach((e: any) => {
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
