import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, isArray, Validator } from "../..";

/** @example { "[]": [V1, V2, V3] } */
export type AmongPredicateExpression<T = any> = Expression<Predicate.AMONG, T[]>;
const AMONG_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.AMONG),
  (accumulator, symbol) => (accumulator[symbol] = (value: any) => isArray(value, undefined)),
  {}
);

export const isAmongPredicateExpression = (value: any): value is AmongPredicateExpression =>
  isExpression(value, AMONG_EXPRESSION_VALIDATORS);

isAmongPredicateExpression.validators = AMONG_EXPRESSION_VALIDATORS;
