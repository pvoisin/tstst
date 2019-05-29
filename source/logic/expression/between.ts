import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, isArray, Validator } from "../..";

/** @example { "[]": [V1, V2, V3] } */
export type BetweenPredicateExpression<T = any> = Expression<Predicate.BETWEEN, [T, T, T]>;
const BETWEEN_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.BETWEEN),
  (accumulator, symbol) => (accumulator[symbol] = (value: any) => isArray(value, undefined, 3)),
  {}
);

export const isBetweenPredicateExpression = (value: any): value is BetweenPredicateExpression =>
  isExpression(value, BETWEEN_EXPRESSION_VALIDATORS);

isBetweenPredicateExpression.validators = BETWEEN_EXPRESSION_VALIDATORS;
