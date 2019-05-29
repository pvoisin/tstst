import * as _ from "lodash";
import { Expression, isExpression } from ".";
import { getOperatorSymbols, Operator } from "..";
import { Dictionary, Validator } from "../..";

/** @example { "!": e1 } */
export type NegationExpression<S extends string = string, V = any> = Expression<Operator.NOT, Expression<S, V>>;

export type NotOperationExpression<S extends string = string, V = any> = NegationExpression<S, V>;

const NEGATION_EXPRESSION_VALIDATORS: Dictionary<Validator> = _.transform(
  getOperatorSymbols(Operator.NOT),
  (accumulator, symbol) => (accumulator[symbol] = isExpression),
  {}
);

/** Tells whether the provided value is a negation expression. */
export const isNegationExpression = <S extends string, V>(value: any): value is NegationExpression<S, V> =>
  isExpression<S, V>(value, NEGATION_EXPRESSION_VALIDATORS);

isNegationExpression.validators = NEGATION_EXPRESSION_VALIDATORS;

export const isNotOperationExpression = isNegationExpression;
