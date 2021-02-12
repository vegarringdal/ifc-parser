import { html } from "lit-html";
import { customElement, property } from "@simple-html/core";
import { Lexer } from "./parser";

@customElement("ifc-reader")
export class IFCReader extends HTMLElement {
  @property() atts = "";

  public render() {
    return html`
      <style>
        ifc-reader {
          display: flex;
        }
      </style>

      <input @change=${this.openFile} type="file" />
      ${new Date().toISOString()} ${this.atts}
    `;
  }

  openFile(e: any) {
    console.time("file");
    const file: File = e.target.files[0];

    const reader = new FileReader();
    const encoder = new TextDecoder();
    const lexer = new Lexer();
    function lexString(d) {
      lexer.input(d);
      // first is always ID
      let ID = lexer.nextToken();
      let NAME = lexer.nextToken();
      let tokens = [NAME];
      let t;
      while (t !== null) {
        t = lexer.nextToken();
        if (t) {
          tokens.push(t);
        }
      }
      //IFC_ID.set(ID, tokens);
    }
    let readFrom = 0;
    let readTo = 0;
    let spareChunk = "";
    let dataBlockFound = false;
    const IFC_ID = new Map();
    const IFC_NAME = new Map();

    window.IFC_ID = IFC_ID;
    window.IFC_NAME = IFC_NAME;
    reader.onload = () => {
      const byteLength = (reader.result as ArrayBuffer).byteLength;

      while (readTo < byteLength) {
        readTo = readTo + 2024;
        if (readTo >= byteLength) {
          readTo = byteLength;
        }
        const buffer = reader.result.slice(readFrom, readTo) as ArrayBuffer;
        let data = encoder.decode(buffer);
        if (spareChunk) {
          data = spareChunk + data;
          spareChunk = "";
        }

        if (!dataBlockFound) {
          for (let i = 0; i < data.length; i++) {
            const d1 = data[i - 4]; // D
            const d2 = data[i - 3]; // A
            const d3 = data[i - 2]; // T
            const d4 = data[i - 1]; // A
            const d5 = data[i]; // ;

            if (
              (d1 || "") + (d2 || "") + (d3 || "") + (d4 || "") + (d5 || "") ===
              "DATA;"
            ) {
              dataBlockFound = true;
              data = data.substring(i, data.length - 1);
              break;
            }
          }
        }
        let lastI = 0;
        for (let i = 0; i < data.length; i++) {
          const d1 = data[i - 1]; // ;
          const d2 = data[i]; // /n

          if (
            (d1 || "") + (d2 || "") === ";\n" ||
            (d1 || "") + (d2 || "") === ";\r"
          ) {
            lexString(data.substring(lastI, i));
            lastI = i;
          }
        }

        if (lastI < data.length) {
          spareChunk = data.substring(lastI, data.length);
        }

        readFrom = readTo;
      }
    };
    reader.onloadend = () => {
      console.timeEnd("file");
      this.atts = window.IFC_ID.size;
    };
    reader.onprogress = (e) => {
      console.log(e);
    };
    reader.readAsArrayBuffer(file);
  }
}
