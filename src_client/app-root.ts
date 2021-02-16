export class AppRoot extends HTMLElement {
  connectedCallback(){
    this.innerHTML = 'hello world'
  }

}

customElements.define("app-root", AppRoot);
