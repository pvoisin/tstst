import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, Validator } from "../..";

/** @example { "=": [V1, V2] } */
export type EqualityExpression<T = any> = Expression<Predicate.EQUAL, [T, T]>;

export type EqualPredicateExpression<T = any> = EqualityExpression<T>;

const EQUALITY_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.EQUAL),
  (accumulator, symbol) => (accumulator[symbol] = () => true),
  {}
);

/** Tells whether the provided value is an equality expression. */
export const isEqualityExpression = <T>(value: any): value is EqualityExpression<T> =>
  isExpression(value, EQUALITY_EXPRESSION_VALIDATORS);

isEqualityExpression.validators = EQUALITY_EXPRESSION_VALIDATORS;

export const isEqualPredicateExpression = isEqualityExpression;
