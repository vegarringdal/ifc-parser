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
      ${new Date().toISOString()}
      ${this.atts} 
    `;
  }

  openFile(e: any) {
    console.time("file");
    const file: File = e.target.files[0];

    const reader = new FileReader();
    const encoder = new TextDecoder();
    const lexer = new Lexer();
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
        readTo = readTo + 1024;
        if (readTo >= byteLength) {
          readTo = byteLength;
        }
        const buffer = reader.result.slice(readFrom, readTo) as ArrayBuffer;
        let data = encoder.decode(buffer);
        if (spareChunk) {
          data = spareChunk + data;
          spareChunk = "";
        }

        const rows = data.split("\n");
        rows.forEach((row) => {
          if (dataBlockFound) {
            let rowData = row;
            if (rowData[rowData.length - 2] && rowData[rowData.length - 2] !== ";") {
              spareChunk = spareChunk + "\n" + rowData;
            } else {
              lexer.input(rowData);
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
              IFC_ID.set(ID, tokens);
            }
          } else {
            let rowData = row;

            if (rowData[rowData.length - 2] !== ";") {
              spareChunk = spareChunk + "\n" + rowData;
            } else {
              if (rowData.trimEnd() === "DATA;") {
                spareChunk = "";
                dataBlockFound = true;
              }
            }
          }
        });

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
