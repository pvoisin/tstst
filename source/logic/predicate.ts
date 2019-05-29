import * as deepFreeze from "deep-freeze";
import { Dictionary, Mapping } from "..";

// ∀
export enum Predicate {
  /** "is equal" */
  EQUAL = "=",
  /** "is different" = "is *NOT* equal"; variation: "!=" */
  DIFFERENT = "≠", // !EQUAL
  /** "is like" */
  LIKE = "~",
  /** "is less than" */
  LESS = "<",
  /** "is less than or equal" = "is *NOT* more"; variation: "<=" */
  LESS_EQUAL = "≤", // !MORE
  /** "is more than" */
  MORE = ">",
  /** "is more than or equal" = "is *NOT* less"; variation: ">=" */
  MORE_EQUAL = "≥", // !LESS
  /** "is between" */
  BETWEEN = "[]",
  /** "is among" */
  AMONG = "{}",
}

/** Predicate symbol varations. */
const predicateSymbolVariations: Mapping<typeof Predicate, string[]> = {
  DIFFERENT: ["!="],
  LESS_EQUAL: ["<="],
  MORE_EQUAL: [">="],
};
deepFreeze(predicateSymbolVariations);

/** `{ EQUAL: [ '=' ], DIFFERENT: [ '≠', '!=' ], LIKE: [ '~' ], LESS: [ '<' ], LESS_EQUAL: [ '≤', '<=' ], MORE: [ '>' ], MORE_EQUAL: [ '≥', '>=' ], BETWEEN: [ '[]' ], AMONG: [ '{}' ] }` */
const symbolsByPredicate: Mapping<typeof Predicate, string[]> = {};
/** `{ '=': '=', '≠': '≠', '!=': '≠', '~': '~', '<': '<', '≤': '≤', '<=': '≤', '>': '>', '≥': '≥', '>=': '≥', '[]': '[]', '{}': '{}' }` */
const predicatesBySymbol: Dictionary<Predicate> = {};
for (const predicate of Object.keys(Predicate)) {
  let symbols = [Predicate[predicate]];
  const variations = predicateSymbolVariations[predicate];
  if (variations) {
    symbols = symbols.concat(predicateSymbolVariations[predicate]);
  }
  symbolsByPredicate[predicate] = symbols;
  for (const symbol of symbols) {
    if (symbol in predicatesBySymbol) {
      throw new Error(`Symbol already used! "${symbol}" (${predicatesBySymbol[symbol]})`);
    }
    predicatesBySymbol[symbol] = Predicate[predicate];
  }
}
deepFreeze(symbolsByPredicate);
deepFreeze(predicatesBySymbol);

/** Returns the symbols representing the given predicate. */
export function getPredicateSymbols(predicate: Predicate): string[] {
  return symbolsByPredicate[predicate];
}

/** Returns the predicate corresponding to the provided symbol. */
export function getPredicateForSymbol(symbol: string): Predicate {
  return predicatesBySymbol[symbol];
}

/** `[ '!', '¬', '&&', '&', '∧', '·', '||', '|', '∨', '+' ]` */
export const PREDICATE_SYMBOLS = Object.keys(predicatesBySymbol);
Object.freeze(PREDICATE_SYMBOLS);

/** Tells whether the provided symbol represents a logical predicate. */
export function isPredicateSymbol(symbol: string): boolean {
  return PREDICATE_SYMBOLS.indexOf(symbol) > -1;
}

/** Normalizes the provided predicate symbol. */
export function normalizePredicateSymbol(symbol: string): Predicate {
  return predicatesBySymbol[symbol];
}
