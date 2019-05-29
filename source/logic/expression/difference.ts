import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getPredicateSymbols, Predicate } from "..";
import { Dictionary, Validator } from "../..";

/** @example { "≠": [V1, V2] } */
export type DifferenceExpression<T = any> = Expression<Predicate.DIFFERENT | "!=", [T, T]>;

export type DifferentPredicateExpression<T = any> = DifferenceExpression<T>;

const DIFFERENCE_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getPredicateSymbols(Predicate.DIFFERENT),
  (accumulator, symbol) => (accumulator[symbol] = () => true),
  {}
);

/** Tells whether the provided value is a difference expression. */
export const isDifferenceExpression = (value: any): value is DifferenceExpression =>
  isExpression(value, DIFFERENCE_EXPRESSION_VALIDATORS);

isDifferenceExpression.validators = DIFFERENCE_EXPRESSION_VALIDATORS;

export const isDifferentPredicateExpression = isDifferenceExpression;
