import { Lexer } from "./lexer";

const lexer = new Lexer();
export function lexString(d: string) {
  lexer.input(d);
  // first is always ID
  let ID = lexer.nextToken();
  // next is name
  let NAME = lexer.nextToken();
  let tokens = [ID, NAME];
  let t;
  while (t !== null) {
    t = lexer.nextToken();
    if (t) {
      tokens.push(t);
    }
  }

  if(ID && ID.value === '#50'){
    console.log(JSON.stringify(tokens))
  }
  // do something with data?
}
