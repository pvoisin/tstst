import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getOperatorSymbols, Operator } from "..";
import { Dictionary, isPair, Validator } from "../..";

/** @example { "||": [e1, e2, e3, …] } */
export type DisjunctionExpression<S extends string = string, V = any> = Expression<Operator.OR, Expression<S, V>[]>;

export type OrOperationExpression<S extends string = string, V = any> = DisjunctionExpression<S, V>;

const DISJUNCTION_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getOperatorSymbols(Operator.OR),
  (accumulator, symbol) => (accumulator[symbol] = (value: any) => isPair(value, isExpression)),
  {}
);

/** Tells whether the provided value is a disjunction expression. */
export const isDisjunctionExpression = <S extends string, V>(value: any): value is DisjunctionExpression<S, V> =>
  isExpression(value, DISJUNCTION_EXPRESSION_VALIDATORS);

isDisjunctionExpression.validators = DISJUNCTION_EXPRESSION_VALIDATORS;

export const isOrOperationExpression = isDisjunctionExpression;
