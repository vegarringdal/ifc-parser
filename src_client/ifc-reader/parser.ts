import { Lexer } from "./lexer";
import { proxyController } from "./proxyController";

let x: any[] = [];

export function getRow(no: number) {
  return x[no];
}

export function getLength() {
  console.log(x[13].name);
  console.log(x[13].id);
  return x.length;
}

function processLine(tokens: any[]) {
  const ID = tokens[0];
  const NAME = tokens[1];

  if (tokens[2] && tokens[2].value === "(") {
    let args = [];
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

    // just for fun, I printed these to se resutl
    if (ID.value === "#13") {
      console.log(ID.value);
      console.log(NAME.value);
      console.log(JSON.stringify(args));
    }

    if (ID && ID.value) {
      x.push(proxyController(ID.value, NAME.value, args));
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
