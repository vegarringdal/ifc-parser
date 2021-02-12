export class Lexer {
  pos: number;
  buf: any;
  buflen: number;
  optable: { ",": string; "(": string; ")": string };

  constructor() {
    this.pos = 0;
    this.buf = null;
    this.buflen = 0;

    // Operator table, mapping operator -> token name
    this.optable = {
      ",": "COMMA",
      "(": "L_PAREN",
      ")": "R_PAREN",
    };
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

    var c = this.buf.charAt(this.pos);

    var op = this.optable[c];
    if (op !== undefined) {
      return { name: op, value: c, pos: this.pos++ };
    } else {
      // Not an operator - so it's the beginning of another token.
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
    var endpos = this.pos + 1;
    while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
      endpos++;
    }

    var tok = {
      name: "ID",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processNumber() {
    var endpos = this.pos + 1;
    while (endpos < this.buflen && this.isDigit(this.buf.charAt(endpos))) {
      endpos++;
    }

    var tok = {
      name: "NUMBER",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processIdentifier() {
    var endpos = this.pos + 1;
    while (endpos < this.buflen && this.isArg(this.buf.charAt(endpos))) {
      endpos++;
    }

    var tok = {
      name: "IDENTIFIER",
      value: this.buf.substring(this.pos, endpos),
      pos: this.pos,
    };
    this.pos = endpos;
    return tok;
  }

  processString() {
    var end_index = this.buf.indexOf("'", this.pos + 1);
    if (end_index === -1) {
      throw Error("Unterminated STRING at " + this.pos);
    } else {
      var tok = {
        name: "STRING",
        value: this.buf.substring(this.pos + 1, end_index),
        pos: this.pos,
      };
      this.pos = end_index + 1;
      return tok;
    }
  }

  skipTokens() {
    while (this.pos < this.buflen) {
      var c = this.buf.charAt(this.pos);
      if (
        c === " " ||
        c === "\t" ||
        c === "\r" ||
        c === "\n" ||
        c === "," ||
        c === "=" ||
        c === ";"
      ) {
        this.pos++;
      } else {
        break;
      }
    }
  }
}
