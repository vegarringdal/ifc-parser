let index: number[] = [];
let m = {};

let names = {};
let byteLength = 1; // so we can access it later
let file: File;
export function getStats() {
  const keys = Object.keys(names);
  const obj: { name: string; length: number }[] = [];
  keys.forEach((key) => {
    obj.push({
      name: key,
      length: names[key].length,
    });
  });
  return {
    names: obj,
    total: index.length / 2,
    fileMB: parseInt((byteLength / (1024 * 1024)) as any),
  };
}

export async function reReadfile(showID: number) {
  if (file) {
    console.time("blobsplice");
    const slice = file.slice(-index[m[showID] + 1], -index[m[showID] + 3]);
    const x = await slice.text();
    console.timeEnd("blobsplice");
    return x;
  } else {
    return "no file loaded";
  }
}

export function readFile(data: any) {
  return new Promise<void>((resolve) => {
    index = [];
    names = {};
    file = data;

    const reader = new FileReader();
    const encoder = new TextEncoder();

    reader.onload = () => {
      console.timeEnd("start read");
      const fileRef = reader.result as ArrayBuffer;
      byteLength = fileRef.byteLength;

      let uIntArrayBuffer = new Uint8Array(fileRef.slice(0, 2000000)); // this will hold memory, I prb need to slice..

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

      // now we have the datablock we will read line by line
      let readFrom = dataRowStart;

      while (readFrom < byteLength) {
        let readTo = readFrom + 4500000;

        let c;

        while (readTo < byteLength) {
          c = new Uint8Array(fileRef.slice(readTo, readTo + 2));
          if (c[0] === 59 && (c[1] === 10 || c[1] === 13)) {
            break;
          }
          readTo++;
        }
        c = new Uint8Array(fileRef.slice(readFrom, readTo));

        // get next line break
        let id = "";
        let rNo = 0;
        let name = "";
        let pos = 0;
        while (pos < c.length) {
          // if no ID, and not #, then continue
          if (!id && c[pos] !== 35) {
            pos++;
            continue;
          }

          if (!id && c[pos] === 35) {
            rNo = pos;
            pos++;
            while (c[pos] > 47 && c[pos] < 58) {
              id = id + String.fromCharCode(c[pos]);
              pos++;
            }
          }

          if (!name && c[pos] >= 65 && c[pos] <= 90) {
            while (c[pos] >= 65 && c[pos] <= 90) {
              name = name + String.fromCharCode(c[pos]);
              pos++;
            }
            if (!names[name]) {
              names[name] = [parseInt(id)];
            } else {
              names[name].push(parseInt(id));
            }
          }

          if (id && c[pos] === 59 && (c[pos + 1] === 10 || c[pos + 1] === 13)) {
            pos++;
            index.push(parseInt(id));
            m[parseInt(id)] = index.length - 1;
            index.push(-(readFrom + rNo));
            rNo = 0;
            id = "";
            name = "";
          }

          pos++;
        }

        readFrom = readTo;
      }
    };
    reader.onloadend = () => {
      resolve();
    };

    // I probably should have sliced it here first to use less memory, and parsed it several times
    console.time("start read");
    reader.readAsArrayBuffer(file);
  });
}
