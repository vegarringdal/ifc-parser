let index: number[] = [];
let names = {};

export function getStats() {
  const keys = Object.keys(names);
  const obj: { name: string; length: number }[] = [];
  keys.forEach((key) => {
    obj.push({ name: key, length: names[key].length });
  });
  return { names: obj, total: index.length / 2 };
}

export function readFile(data: any) {
  return new Promise<void>((resolve) => {
    index = [];
    names = {};
    const file = data;

    const reader = new FileReader();
    const encoder = new TextEncoder();

    reader.onload = () => {
      const byteLength = (reader.result as ArrayBuffer).byteLength;
      const uIntArrayBuffer = new Uint8Array(reader.result as ArrayBuffer);

      function getDataSection(arrBuff: Uint8Array) {
        const d = encoder.encode("DATA;");
        let i = 0;
        let size = arrBuff.byteLength;
        const c = arrBuff;
        while (i < size) {
          if (c[i] === d[0]) {
            if (c[i + 1] === d[1]) {
              if (c[i + 2] === d[2]) {
                if (c[i + 3] === d[3]) {
                  if (c[i + 4] === d[4]) {
                    return i + 4;
                  }
                }
              }
            }
          }
          i++;
        }

        return -1;
      }

      const dataRowStart = getDataSection(uIntArrayBuffer);
      if (!dataRowStart) {
        throw 'ifc file is missing "DATA;" section';
      }

      function findNextLineSlice(arrBuff: Uint8Array, from: number) {
        let i = from;
        let size = arrBuff.byteLength;
        const c = arrBuff;
        while (i < size) {
          if (c[i] === 59 && (c[i + 1] === 10 || c[i + 1] === 13)) {
            return i + 1;
          }
          i++;
        }

        return size;
      }

      // now we have the datablock we will read line by line
      let readFrom = dataRowStart;
      const c = uIntArrayBuffer;

      while (readFrom < byteLength) {
        let readTo = findNextLineSlice(c, readFrom + 1000000);
        // get next line break
        let id = "";
        let rNo = 0;
        let name = "";
        while (readFrom < readTo) {
          // if no ID, and not #, then continue
          if (!id && c[readFrom] !== 35) {
            readFrom++;
            continue;
          }

          if (!id && c[readFrom] === 35) {
            readFrom++;
            rNo = readFrom;
            while (c[readFrom] > 47 && c[readFrom] < 58) {
              id = id + String.fromCharCode(c[readFrom]);
              readFrom++;
            }
          }

          if (!name && c[readFrom] >= 65 && c[readFrom] <= 90) {
            while (c[readFrom] >= 65 && c[readFrom] <= 90) {
              name = name + String.fromCharCode(c[readFrom]);
              readFrom++;
            }
            if (!names[name]) {
              names[name] = [parseInt(id)];
            } else {
              names[name].push(parseInt(id));
            }
          }

          if (
            id &&
            c[readFrom] === 59 &&
            (c[readFrom + 1] === 10 || c[readFrom + 1] === 13)
          ) {
            readFrom++;
            index.push(parseInt(id));
            index.push(-rNo);
            rNo = 0;
            id = "";
            name = "";
          }

          readFrom++;
        }

        readFrom = readTo;
      }
    };
    reader.onloadend = () => {
      resolve();
    };
    reader.readAsArrayBuffer(file);
  });
}
