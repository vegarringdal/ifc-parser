import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { getStats, readFile, reReadfile } from "./reader";

@customElement("ifc-reader")
export class IFCReader extends HTMLElement {
  memory = `${
    (performance as any).memory.usedJSHeapSize / Math.pow(1000, 2)
  } MB`;
  memoryAfter = "tba";
  time = 0;
  stats: {
    names: { name: string; length: number }[];
    total: number;
    fileMB: number;
  };
  text = "";

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
              (performance as any).memory.usedJSHeapSize / Math.pow(1000, 2)
            } MB`;
            this.render();
          }}
          class="p-2 m-2 bg-indigo-300"
        >
          update heap
        </button>
        <input
          @change=${(e: any) => {
            reReadfile(e.target.valueAsNumber).then((result) => {
              this.text = result;
              this.render();
            });
          }}
          class="p-2 m-2 bg-indigo-300"
          type="number"
          minlength="0"
        />
        <span style="width:250px" class="break-words">${this.text}</span>
      </div>
      <div class="flex flex-col border-1 border-gray-400 p-2 m-2">
        <span>memory before: ${this.memory}</span>
        <span>memory after file: ${this.memoryAfter}</span>
        <span>file size: ${this.stats?.fileMB}</span>
        <span>runtime openfile: ${this.time}</span>
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
    this.text = "";
    await readFile(file);
    this.time = performance.now() - v1;
    this.memoryAfter = `${
      (performance as any).memory.usedJSHeapSize / Math.pow(1000, 2)
    } MB`;

    this.stats = getStats();

    this.render();
  }
}
