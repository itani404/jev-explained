export type TokenType =
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'property'
  | 'function'
  | 'punct'
  | 'plain';

export type Token = { type: TokenType; text: string };

// Small single-line tokenizer for TS/JSON snippets. Not a real parser, just enough to color
// the short, known code shown on this page.
const RULES: [TokenType, RegExp][] = [
  ['comment', /^\/\/.*/],
  ['string', /^(['"`])(?:\\.|(?!\1).)*\1/],
  ['keyword', /^(?:const|let|await|async|import|from|export|return|if|else|true|false|null|undefined)\b/],
  ['number', /^\d+(?:\.\d+)?/],
  ['function', /^[A-Za-z_$][\w$]*(?=\s*\()/],
  ['property', /^[A-Za-z_$][\w$]*(?=\s*:)/],
  ['plain', /^[A-Za-z_$][\w$]*/],
  ['punct', /^[{}()[\],.;:=<>!?+\-*/&|]+/],
  ['plain', /^\s+/],
];

export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  while (rest.length) {
    let matched = false;
    for (const [type, re] of RULES) {
      const m = rest.match(re);
      if (!m) continue;
      let t = type;
      // A quoted JSON key reads as a property, not a string.
      if (t === 'string' && /^\s*:/.test(rest.slice(m[0].length))) t = 'property';
      tokens.push({ type: t, text: m[0] });
      rest = rest.slice(m[0].length);
      matched = true;
      break;
    }
    if (!matched) {
      tokens.push({ type: 'plain', text: rest[0] });
      rest = rest.slice(1);
    }
  }

  return tokens;
}
