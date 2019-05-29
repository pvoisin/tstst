import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, isObject, Validator } from "../..";

/** @example { ">": [V1, V2] } */
export type StrictSuperiorityExpression<T = any> = Expression<Predicate.MORE, [T, T]>;

export type MorePredicateExpression<T = any> = StrictSuperiorityExpression<T>;

const STRICT_SUPERIORITY_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.MORE),
  (accumulator, symbol) => (accumulator[symbol] = isObject),
  {}
);

/** Tells whether the provided value is a strict superiority expression. */
export const isStrictSuperiorityExpression = <T>(value: any): value is StrictSuperiorityExpression<T> =>
  isExpression(value, STRICT_SUPERIORITY_EXPRESSION_VALIDATORS);

isStrictSuperiorityExpression.validators = STRICT_SUPERIORITY_EXPRESSION_VALIDATORS;

export const isMoreExpression = isStrictSuperiorityExpression;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/** @example { "≥": [V1, V2] } */
export type SuperiorityExpression<T = any> = Expression<Predicate.MORE_EQUAL | ">=", [T, T]>;

export type MoreEqualPredicateExpression<T = any> = SuperiorityExpression<T>;

const SUPERIORITY_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.MORE_EQUAL),
  (accumulator, symbol) => (accumulator[symbol] = () => true),
  {}
);

/** Tells whether the provided value is an superiority expression. */
export const isSuperiorityExpression = (value: any): value is SuperiorityExpression =>
  isExpression(value, SUPERIORITY_EXPRESSION_VALIDATORS);

isSuperiorityExpression.validators = SUPERIORITY_EXPRESSION_VALIDATORS;

export const isMoreEqualPredicateExpression = isSuperiorityExpression;
