import { Lexer } from "./lexer";

let x: any[] = [];

export function getLast() {
  let y = x;
  x = [];
  return y;
}

const lexer = new Lexer();
export function lexString(d: string) {
  lexer.input(d);
  // first is always ID
  let ID = lexer.nextToken();
  // next is name
  let NAME = lexer.nextToken();
  let tokens = [];
  let t;
  while (t !== null) {
    t = lexer.nextToken();
    if (t) {
      tokens.push(t);
    }
  }

  if (tokens[0] && tokens[0].value === "(") {
    let args = [];
    for (let i = 1; i < tokens.length; i++) {
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

    if (ID.value === "#13") {
      console.log(ID.value);
      console.log(NAME.value);
      console.log(JSON.stringify(args));
    }

    if (ID && ID.value) {
      x.push([ID.value, NAME.value, args]);
    }

    if (x.length > 25000) {
      (self as any).postMessage(x);
      x = [];
    }
  }

  // do something with data?
}
