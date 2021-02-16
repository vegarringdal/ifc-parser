(() => {
  // src_client/app-root.ts
  var AppRoot = class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = "hello world";
    }
  };
  customElements.define("app-root", AppRoot);
})();
//# sourceMappingURL=index.js.map
