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

let y: any = [];

let posts = 0;
let recived = 0;

var channel1 = new MessageChannel();
channel1.port2.onmessage = (e) => {
  y = y.concat(e.data);
  recived++;
  if (posts === recived) {
    console.log("done", y.length);
    console.timeEnd("xx");
  }
};

var channel2 = new MessageChannel();
channel2.port2.onmessage = (e) => {
  y = y.concat(e.data);
  recived++;
  if (posts === recived) {
    console.log("done", y.length);
    console.timeEnd("xx");
  }
};

var channel3 = new MessageChannel();
channel3.port2.onmessage = (e) => {
  y = y.concat(e.data);
  recived++;
  if (posts === recived) {
    console.log("done", y.length);
    console.timeEnd("xx");
  }
};

console.log("worker");
export const readerWorker = new Worker("readerWorker.js");
readerWorker.postMessage("channel", [
  channel1.port1,
  channel2.port1,
  channel3.port1,
]);

readerWorker.addEventListener("message", (e) => {
  posts = e.data;
  console.time("xx");
  if (posts === recived) {
    console.log("done", y.length);
    console.timeEnd("xx");
    console.log(y[0]);
  }
});
