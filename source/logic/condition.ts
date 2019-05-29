import { getOperatorForSymbol, Operator } from ".";
import { isArray, isObject } from "..";

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
  public name: string = this.constructor.name;
}

/**
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
  if (expression && !isObject(expression)) {
    throw new InvalidConditionExpressionError(`Invalid condition expression! ${expression}`);
  }

  const condition: Condition = { operator, elements: [] };

  const elements: object[] = isArray(expression) ? expression : [expression];
  let predicateSet: PredicateSet = {};
  let predicateSetIsEmpty: boolean = true;
  function prepareNextPredicateBucket() {
    condition.elements.push(predicateSet);
    predicateSet = {};
    predicateSetIsEmpty = true;
  }

  for (const element of elements) {
    for (const fieldKey of Object.keys(element)) {
      const operator = getOperatorForSymbol(fieldKey);
      if (operator) {
        if (!predicateSetIsEmpty) {
          prepareNextPredicateBucket();
        }

        // Append sub-condition:
        condition.elements.push(getCondition(element[fieldKey], operator));
      } else {
        if (fieldKey in predicateSet && predicateSet !== element[fieldKey]) {
          prepareNextPredicateBucket();
        }

        // Augment current predicate set:
        predicateSet[fieldKey] = element[fieldKey];
        predicateSetIsEmpty = false;
      }
    }
  }

  if (condition.elements[condition.elements.length - 1] !== predicateSet) {
    condition.elements.push(predicateSet);
  }

  return normalizeCondition(condition);
}

interface ConditionElementBucketSet<P> {
  predicateSets: P[];
  conditions: Condition<P>[];
}

/**  Reduces the provided condition to its simplest form. */
export function normalizeCondition<P>(condition: Condition<P>, siblingCount?: number): ConditionElement<P> {
  // TODO: clone conditions & predicates to leave provided objects untouched
  let result: ConditionElement<P> = condition;
  const buckets: ConditionElementBucketSet<P> = {
    predicateSets: [],
    conditions: [],
  };

  const elementCount: number = result.elements.length;
  for (const element of result.elements) {
    if (isCondition(element)) {
      let simplifiedElement: ConditionElement<P> = normalizeCondition(element, elementCount - 1);
      allocateSimplifiedElement(condition, simplifiedElement, buckets);
    } else {
      allocatePredicateSet(element, buckets);
    }
  }

  result.elements = [].concat(buckets.predicateSets, buckets.conditions);

  // Operations expecting multiple variables, like "and" & "or", can always be
  // simplified when they have only one variable or element being a condition itself.
  // Example: { "||": [{ "&&": [{ "A":1, "B":2, "C": 3 }] }] } → { "&&": [{ "A":1, "B":2, "C": 3 }] }
  if (result.elements.length <= 1 && result.operator !== Operator.NOT) {
    const element = result.elements[0];
    if (isCondition(element) || Object.keys(element).length <= 1) {
      result = element;
    }
  }

  // Simplify top-level conjunctions even more, if possible:
  if (siblingCount === undefined && isConjunction(result) && result.elements.length <= 1) {
    result = result.elements[0];
  }

  return result;
}

function allocateSimplifiedElement<P>(
  condition: Condition<P>,
  simplifiedElement: ConditionElement<P>,
  buckets: ConditionElementBucketSet<P>
) {
  if (isCondition(simplifiedElement)) {
    if (condition.operator === simplifiedElement.operator) {
      allocateSubCondition(simplifiedElement, buckets);
    } else {
      buckets.conditions.push(simplifiedElement);
    }
  } else {
    allocatePredicateSet(simplifiedElement, buckets);
  }
}

function allocateSubCondition<P>(subCondition: Condition<P>, buckets: ConditionElementBucketSet<P>) {
  for (const subElement of subCondition.elements) {
    if (isCondition(subElement)) {
      buckets.conditions.push(subElement);
    } else {
      allocatePredicateSet(subElement, buckets);
    }
  }
}

/**
 * Allocates the provided predicates so that existing predicates are neither
 * repeated (when having same values) nor overwritten (when having different
 * values).
 *
 * @example
 * predicateSet = { "A": 1, "B": 2, "C": 3 }
 * buckets.predicateSets = [{ "A": 1, "B": 1 }]
 * allocatePredicateSet(predicateSet, buckets)
 *  → [{ "A": 1, "B": 1, "C": 3 }, { "B": 2 }]
 */
function allocatePredicateSet<P extends PredicateSet>(predicateSet: P, buckets: ConditionElementBucketSet<P>) {
  for (const fieldKey of Object.keys(predicateSet)) {
    const fieldValue = predicateSet[fieldKey];

    let bucket: P;
    for (const candidate of buckets.predicateSets) {
      if (!(fieldKey in candidate) || candidate[fieldKey] === fieldValue) {
        bucket = candidate;
        break;
      }
    }
    if (!bucket) {
      bucket = {} as P;
      buckets.predicateSets.push(bucket);
    }

    bucket[fieldKey] = fieldValue;
  }
}

export const DEFAULT_OPERATOR_SERIALIZERS: { [key in Operator]: string } = {
  [Operator.NOT]: "!",
  [Operator.AND]: "&&",
  [Operator.OR]: "||",
};
/*
export class ConditionSerializer {
  public serialize(condition: ConditionExpression, result?: string): string {
    if (condition) {
      if (!result) {
        result = "";
      }

      const keys = Object.keys(condition);
    }

    return result;
  }
}

export class PredicateSerializer {
  public serialize(predicate: Predicate): string {
    let result: string;

    if (predicate) {
      const fieldKeys = Object.keys(predicate);
      for (const fieldKey of fieldKeys) {
        this.validateFieldKey(fieldKey);
      }
    }

    return result;
  }

  protected validateFieldKey(fieldKey: string) {
    if (fieldKey in Operators) {
      throw new InvalidFieldKeyError(`Invalid field key! ${fieldKey}`);
    }
  }
}

export class InvalidFieldKeyError extends Error {
  public name: string = this.constructor.name;
  public data: any;
}
//*/
