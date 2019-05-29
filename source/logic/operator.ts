import * as deepFreeze from "deep-freeze";
import { Dictionary, Mapping } from "..";

/** Logical operators (with their normalized symbols). */
export enum Operator {
  /** Negation; variation: "¬". */
  NOT = "!",
  /** Conjunction; variations: "&", "∧", "·". */
  AND = "&&",
  /** Disjunction; variations: "|", "∨", "+". */
  OR = "||",
}

/** Logical operator symbol varations. */
const operatorSymbolVariations: Mapping<typeof Operator, string[]> = {
  NOT: ["¬"],
  AND: ["&", "∧", "·"],
  OR: ["|", "∨", "+"],
};
deepFreeze(operatorSymbolVariations);

/** `{ NOT: [ '!', '¬' ], AND: [ '&&', '&', '∧', '·' ], OR: [ '||', '|', '∨', '+' ] }` */
const symbolsByOperator: Mapping<typeof Operator, string[]> = {};
/** `{ '!': '!', '¬': '!', '&&': '&&', '&': '&&', '∧': '&&', '·': '&&', '||': '||', '|': '||', '∨': '||', '+': '||' }` */
const operatorsBySymbol: Dictionary<Operator> = {};
for (const operator of Object.keys(Operator)) {
  let symbols = [Operator[operator]];
  const variations = operatorSymbolVariations[operator];
  if (variations) {
    symbols = symbols.concat(variations);
  }
  symbolsByOperator[Operator[operator]] = symbols;
  for (const symbol of symbols) {
    if (symbol in operatorsBySymbol) {
      throw new Error(`Symbol already used! "${symbol}" (${operatorsBySymbol[symbol]})`);
    }
    operatorsBySymbol[symbol] = Operator[operator];
  }
}
deepFreeze(symbolsByOperator);
deepFreeze(operatorsBySymbol);

/** Returns the symbols representing the given operator. */
export function getOperatorSymbols(operator: Operator): string[] {
  return symbolsByOperator[operator];
}

/** Returns the operator corresponding to the provided symbol. */
export function getOperatorForSymbol(symbol: string): Operator {
  return operatorsBySymbol[symbol];
}

/** `[ '!', '¬', '&&', '&', '∧', '·', '||', '|', '∨', '+' ]` */
export const OPERATOR_SYMBOLS = Object.keys(operatorsBySymbol);
Object.freeze(OPERATOR_SYMBOLS);

/** Tells whether the provided symbol represents a logical operator. */
export function isOperatorSymbol(symbol: string): boolean {
  return OPERATOR_SYMBOLS.indexOf(symbol) > -1;
}

/** Normalizes the provided operator symbol. */
export function normalizeOperatorSymbol(symbol: string): Operator {
  return operatorsBySymbol[symbol];
}
