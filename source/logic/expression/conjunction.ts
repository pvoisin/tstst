import * as _ from "lodash";
import { Expression, isExpression, isExpressionArray } from ".";
import { getOperatorSymbols, Operator } from "..";
import { Dictionary, Validator } from "../..";

/** @example { "&&": [e1, e2, e3, …] } */
export type ConjunctionExpression<S extends string = string, V = any> = Expression<Operator.AND, Expression<S, V>[]>;

export type AndOperationExpression<S extends string = string, V = any> = ConjunctionExpression<S, V>;

const CONJUNCTION_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getOperatorSymbols(Operator.AND),
  (accumulator, symbol) => (accumulator[symbol] = isExpressionArray),
  {}
);

/** Tells whether the provided value is a conjunction expression. */
export const isConjunctionExpression = <S extends string, V>(value: any): value is ConjunctionExpression<S, V> =>
  isExpression<S, V>(value, CONJUNCTION_EXPRESSION_VALIDATORS);

isConjunctionExpression.validators = CONJUNCTION_EXPRESSION_VALIDATORS;

export const isAndOperationExpression = isConjunctionExpression;
