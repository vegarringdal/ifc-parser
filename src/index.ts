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
