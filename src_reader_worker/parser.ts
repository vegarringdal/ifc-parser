import { Lexer } from "./lexer";

let x: any[] = [];

export function getLast() {
  let y = x;
  x = [];
  return y;
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
      x.push([ID.value, NAME.value, args]);
    }

    if (x.length > 1000) { 
      (self as any).postMessage(x);
      x = [];
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
