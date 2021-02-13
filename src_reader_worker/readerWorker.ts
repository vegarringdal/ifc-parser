import { lexString } from "parser";

onmessage = function (e) {
  console.time("file");
  const file = e.data;

  const reader = new FileReader();
  const encoder = new TextDecoder();
  const decoder = new TextEncoder();
  const dataTagBuffer = decoder.encode("DATA;");
  const dataTagUintArray = new Uint8Array(dataTagBuffer);

  let readFrom = 0;
  let readTo = 0;

  reader.onload = () => {
    const byteLength = (reader.result as ArrayBuffer).byteLength;

    // first part we read until we get the data block
    let i = readFrom;
    const y = dataTagUintArray;
    while (i !== byteLength) {
      const buffer = reader.result.slice(i, i + 5) as ArrayBuffer;
      const x = new Uint8Array(buffer);
      //  until we find "DATA;"
      if (
        x[0] === y[0] &&
        x[1] === y[1] &&
        x[2] === y[2] &&
        x[3] === y[3] &&
        x[4] === y[4]
      ) {
        readFrom = i + 5; //one extra to skip newline
        break;
      }
      i++;
    }

    // now we have the datablock we will read line by line
    while (readTo < byteLength) {
      let i = readFrom + 4000;
      // get next line break
      while (i !== byteLength) {
        const buffer = reader.result.slice(i, i + 2) as ArrayBuffer;
        const x = new Uint8Array(buffer);
        //  until we find newline/linebreak
        if (x[0] === 10 || x[0] === 13) {
          readTo = i + 1;
          if (x[1] === 10 || x[1] === 13) {
            readTo = i + 2;
          }
          break;
        }
        if (i >= byteLength) {
          readTo = byteLength;
          break;
        }
        i++;
      }

      const buffer = reader.result.slice(readFrom, readTo) as ArrayBuffer;
      let data = encoder.decode(buffer);
      const x = data.split("\n");
      for (let i = 0; i < x.length; i++) {
        lexString(x[i]);
      }

      readFrom = readTo;
    }
  };
  reader.onloadend = () => {
    console.timeEnd("file");
  };
  reader.onprogress = (e) => {
    console.log(e);
  };
  reader.readAsArrayBuffer(file);
};
