import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { readFile } from "./readerWorker";

@customElement("ifc-reader")
export class IFCReader extends HTMLElement {
  public render() {
    return html`
      <style>
        ifc-reader {
          display: flex;
        }
      </style>

      <input @change=${this.openFile} type="file" />
    `;
  }

  openFile(e: any) {
    const file: File = e.target.files[0];
    readFile(file);
  }
}
