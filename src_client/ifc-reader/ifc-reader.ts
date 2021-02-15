import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { getStats, readFile } from "./reader";

@customElement("ifc-reader")
export class IFCReader extends HTMLElement {
  memory = `${performance.memory.usedJSHeapSize / Math.pow(1000, 2)} MB`;
  memoryAfter = "tba";
  time = 0;
  stats: {
    names: { name: string; length: number }[];
    total: number;
    fileMB: number;
  };

  public render() {
    return html`
      <style>
        ifc-reader {
          display: flex;
        }
      </style>
      <div class="flex flex-col border-1 border-gray-400 p-2 m-2">
        <label class="p-2 m-2 bg-indigo-300">
          <input @change=${this.openFile} type="file" value="" />
          select IFC file
        </label>
        <button
          @click=${() => {
            this.memoryAfter = `${
              performance.memory.usedJSHeapSize / Math.pow(1000, 2)
            } MB`;
            this.render();
          }}
          class="p-2 m-2 bg-indigo-300"
        >
          update heap
        </button>
      </div>
      <div class="flex flex-col border-1 border-gray-400 p-2 m-2">
        <span>memory before: ${this.memory}</span>
        <span>memory after file: ${this.memoryAfter}</span>
        <span>file size: ${this.memoryAfter}</span>
        <span>runtime openfile: ${this.stats?.fileMB}</span>
        <span>total ids: ${this.stats?.total}</span>
      </div>

      <div
        class="flex flex-col border-1 border-gray-400 p-2 m-2 max-h-screen overflow-y-auto"
      >
        ${this.getList()}
      </div>
    `;
  }

  getList() {
    if (this.stats && this.stats.names) {
      return this.stats.names.map((e) => {
        return html`<span>${e.name}:${e.length}</span>`;
      });
    }
    return "";
  }

  async openFile(e: any) {
    const file: File = e.target.files[0];
    const v1 = performance.now();
    await readFile(file);
    this.time = performance.now() - v1;
    this.memoryAfter = `${
      performance.memory.usedJSHeapSize / Math.pow(1000, 2)
    } MB`;

    this.stats = getStats();

    this.render();
  }
}
