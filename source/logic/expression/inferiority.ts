import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, isObject, Validator } from "../..";

/** @example { "<": [V1, V2] } */
export type StrictInferiorityExpression<T = any> = Expression<Predicate.LESS, [T, T]>;

export type LessPredicateExpression<T = any> = StrictInferiorityExpression<T>;

const STRICT_INFERIORITY_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.LESS),
  (accumulator, symbol) => (accumulator[symbol] = isObject),
  {}
);

/** Tells whether the provided value is a strict inferiority expression. */
export const isStrictInferiorityExpression = <T>(value: any): value is StrictInferiorityExpression<T> =>
  isExpression(value, STRICT_INFERIORITY_EXPRESSION_VALIDATORS);

isStrictInferiorityExpression.validators = STRICT_INFERIORITY_EXPRESSION_VALIDATORS;

export const isLessExpression = isStrictInferiorityExpression;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/** @example { "≤": [V1, V2] } */
export type InferiorityExpression<T = any> = Expression<Predicate.LESS_EQUAL | "<=", [T, T]>;

export type LessEqualPredicateExpression<T = any> = InferiorityExpression<T>;

const INFERIORITY_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.LESS_EQUAL),
  (accumulator, symbol) => (accumulator[symbol] = () => true),
  {}
);

/** Tells whether the provided value is an inferiority expression. */
export const isInferiorityExpression = (value: any): value is InferiorityExpression =>
  isExpression(value, INFERIORITY_EXPRESSION_VALIDATORS);

isInferiorityExpression.validators = INFERIORITY_EXPRESSION_VALIDATORS;

export const isLessEqualPredicateExpression = isInferiorityExpression;
