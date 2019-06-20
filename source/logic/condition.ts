import { Operator } from ".";
import { isObject } from "..";
import { DEFAULT_CONDITION_EXPRESSION_PARSER } from "./expression/parser";

/**
 * Predicate: simplest version of a condition expression.
 * Condition: expression consisting of one or more predicates linked together with logical operators.
 * Predicates & conditions can be inverted by using the "not" (negation) operator.
 * Conditions can be composed of other conditions.
 */

//#endregion

//#region condition

export interface PredicateSet<T = any> {
  [key: string]: T;
}

export interface Condition<P extends PredicateSet = any> {
  operator: Operator;
  /**
   * Elements of this condition, being either predicates or other conditions.
   * Note: there could be different predicates for the same field; example: `{"||": [{A:1}, {A:null}]}`.
   */
  elements: ConditionElement<P>[];
}

export type ConditionElement<P> = Condition<P> | P;

export function isCondition(value: any, operator?: Operator): value is Condition {
  return (
    value &&
    isObject(value) &&
    "operator" in value &&
    "elements" in value &&
    (operator === undefined || value.operator === operator)
  );
}

export function isConjunction(value: any): value is Condition {
  return isCondition(value, Operator.AND);
}

export class InvalidConditionExpressionError extends Error {
  name: string = this.constructor.name;
}

/**
 * Parses the provided expression into a normalized condition.
 *
 * @example
 *  expression = {
 *   "&&": [
 *     {
 *       "ANIMAL.breed": "*shepard",
 *       "OWNER.id": 34087346,
 *       "!": {
 *         "PERMIT.acknowledged": null
 *       },
 *       "||": [
 *          { expiryDate: null },
 *          { expiryDate: [null, new Date()] },
 *       ]
 *     }
 *    ]
 *  }
 */
export function getCondition<P>(expression: object, operator: Operator = Operator.AND): Condition<P> {
  return DEFAULT_CONDITION_EXPRESSION_PARSER.parse(expression, operator);
}
