import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import "./ifc-reader/ifc-reader";

@customElement("app-root")
export default class extends HTMLElement {
  public render() {
    return html` <ifc-reader class="p-2"></ifc-reader> `;
  }
}
