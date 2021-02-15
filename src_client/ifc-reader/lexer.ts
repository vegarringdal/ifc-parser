/* // this is just a little weird project, took some lexer I found somewhere and rebuild it a little

export class Lexer {
  pos: number;
  buf: any;
  buflen: number;

  constructor() {
    this.pos = 0;
    this.buf = null;
    this.buflen = 0;
  }

  input(buf: string) {
    this.pos = 0;
    this.buf = buf;
    this.buflen = buf.length;
  }

  nextToken = function () {
    this.skipTokens();

    if (this.pos >= this.buflen) {
      return null;
    }

    const c = this.buf.charAt(this.pos);
    let op;
    if (c === ",") {
      op = "C";
    }
    if (c === ";") {
      op = "E";
    }
    if (c === "(") {
      op = "L";
    }
    if (c === ")") {
      op = "R";
    }

    if (op) {
      return { name: op, value: c, pos: this.pos++ };
    } else {
      switch (true) {
        case this.isID(c):
          return this.processID();
        case this.isArg(c):
          return this.processIdentifier();
        case c === "'":
          return this.processString();
        default:
          throw "unknow token" + c;
      }
    }
  };

  isID(c: string) {
    return c === "#";
  }

  isNewLine(c: string) {
    return c === "\r" || c === "\n";
  }

  isDigit(c: string) {
    return c >= "0" && c <= "9";
  }

  isArg(c: string) {
    return (
      (c >= "a" && c <= "z") ||
      (c >= "A" && c <= "Z") ||
      (c >= "0" && c <= "9") ||
      c === "_" ||
      c === "-" ||
      c === "*" ||
      c === "$" ||
      c === ":" ||
      c === "."
    );
  }

  processID() {
    let endpos = this.pos + 1;
    while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
      endpos++;
    }

    const tok = {
      name: "ID",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processNumber() {
    let endpos = this.pos + 1;
    while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
      endpos++;
    }

    const tok = {
      name: "N",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processIdentifier() {
    let endpos = this.pos + 1;
    while (endpos < this.buflen && this.isArg(this.buf.charAt(endpos))) {
      endpos++;
    }

    const tok = {
      name: "I",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processString() {
    const end_index = this.buf.indexOf("'", this.pos + 1);
    if (end_index === -1) {
      throw Error("Unterminated STRING at " + this.pos);
    } else {
      const tok = {
        name: "S",
        value: this.buf.substring(this.pos + 1, end_index),
        pos: this.pos,
      };
      this.pos = end_index + 1;
      return tok;
    }
  }

  skipTokens() {
    while (this.pos < this.buflen) {
      const c = this.buf.charAt(this.pos);
      if (
        c === " " ||
        c === "\t" ||
        c === "\r" ||
        c === "\n" ||
        c === "," ||
        c === "="
      ) {
        this.pos++;
      } else {
        break;
      }
    }
  }
}
 */