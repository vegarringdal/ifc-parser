/* import { Lexer } from "./lexer";

let dataRows = new Map();
let ifcRelContainedInSpatialStructure: number[] = [];

export function getRow(no: number) {
  return dataRows[no];
}

export function getIfcRelContainedInSpatialStructureIDs() {
  return ifcRelContainedInSpatialStructure;
}

export function getLength() {
  // lets print one to testa

  console.log(
    "ifcRelContainedInSpatialStructure count:" +
      ifcRelContainedInSpatialStructure.length
  );
  console.log("-------------------------------------------");
  console.log("total datarow count:" + dataRows.size);

  return dataRows.size;
}

function processLine(tokens: any[]) {
  const ID = tokens[0];
  const NAME = tokens[1];

  if (tokens[2] && tokens[2].value === "(") {
    let args = [];
    args.push(NAME);
    for (let i = 3; i < tokens.length; i++) {
      if (tokens[i].value !== "(" && tokens[i].value !== ")") {
        args.push(tokens[i].value);
      } else {
        if (tokens[i].value !== ")") {
          let offArg = [];
          i++;
          while (tokens[i].value !== ")") {
            offArg.push(tokens[i].value);
            i++;
          }
          args.push(offArg);
        }
      }
    }

    if (ID && ID.value) {
      dataRows.set(ID.value, { args });
      if (NAME.value === "IFCRELCONTAINEDINSPATIALSTRUCTURE") {
        ifcRelContainedInSpatialStructure.push(dataRows.size - 1);
      }
    }
  }
}

const lexer = new Lexer();
export function lexString(d: string) {
  lexer.input(d);
  // first is always ID

  let tokens = [];
  let t;
  while (t !== null) {
    t = lexer.nextToken();
    if (t && t.value === ";") {
      processLine(tokens);
      tokens = [];
    } else {
      if (t) {
        tokens.push(t);
      }
    }
  }

  // do something with data?
}
 */