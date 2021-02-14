let rows = 0;

let channel: any = null;

let readerWorker1: Worker;
let readerWorker2: Worker;
let readerWorker3: Worker;

let toggle = 0;

onmessage = function (e) {
  if (e.data === "channel") {
    readerWorker1 = new Worker("parserWorker.js");
    readerWorker1.postMessage("channel", [e.ports[0]]);
    readerWorker2 = new Worker("parserWorker.js");
    readerWorker2.postMessage("channel", [e.ports[1]]);
    readerWorker3 = new Worker("parserWorker.js");
    readerWorker3.postMessage("channel", [e.ports[2]]);
    return;
  }

  console.log("worker-called");
  console.time("file");
  rows = 0;
  const file = e.data;

  const reader = new FileReader();
  const encoder = new TextDecoder();
  const decoder = new TextEncoder();
  const dataTagBuffer = decoder.encode("DATA;");
  const dataTagUintArray = new Uint8Array(dataTagBuffer);

  let readFrom = 0;
  let readTo = 0;

  let posts = 0;

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
      let i = readFrom + 5000000;
      // get next line break
      while (i !== byteLength) {
        const buffer = reader.result.slice(i, i + 2) as ArrayBuffer;
        const x = new Uint8Array(buffer);
        //  until we find newline/linebreak & ;
        if (x[0] === 59 && (x[1] === 10 || x[1] === 13)) {
          readTo = i + 1;
          break;
        }
        if (i >= byteLength) {
          readTo = byteLength;
          break;
        }
        i = i + 1;
      }

      const buffer = reader.result.slice(readFrom, readTo) as ArrayBuffer;
      let data = encoder.decode(buffer);

      if (toggle === 0) {
        toggle = 1;
        posts++;
        readerWorker1.postMessage(data);
      }
      if (toggle === 1) {
        toggle = 2;
        posts++;
        readerWorker2.postMessage(data);
      }

      if (toggle === 2) {
        toggle = 0;
        posts++;
        readerWorker3.postMessage(data);
      }

      readFrom = readTo;
    }
  };
  reader.onloadend = () => {
    console.timeEnd("file");
    self.postMessage(posts);
  };
  reader.onprogress = (e) => {
    console.log(e);
  };
  reader.readAsArrayBuffer(file);
};

/* var channel = new MessageChannel();
channel.port1.postMessage('cool1')
channel.port2.postMessage('cool2') */
