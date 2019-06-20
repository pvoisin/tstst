import { getOperatorForSymbol, Operator, Condition } from "..";
import { isArray, isObject } from "../..";
import {
  InvalidConditionExpressionError,
  PredicateSet,
  getCondition,
  ConditionElement,
  isCondition,
  isConjunction,
} from "../condition";

export interface ConditionParser {
  parse<P>(expression: object, operator?: Operator): Condition<P>;
  normalize<P>(condition: Condition<P>, siblingCount?: number): ConditionElement<P>;
}

export class DefaultConditionParser {
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
  public parse<P>(expression: object, operator: Operator = Operator.AND): Condition<P> {
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

    return this.normalize(condition);
  }

  /**
   * Reduces the provided condition to its simplest form.
   *
   * @param siblingCount Count of siblings that the provided condition has.
   */
  normalize<P>(condition: Condition<P>, siblingCount?: number): ConditionElement<P> {
    // TODO: clone conditions & predicates to leave provided objects untouched
    let result: ConditionElement<P> = condition;
    const buckets: ConditionElementBucketSet<P> = {
      predicateSets: [],
      conditions: [],
    };

    const elementCount: number = result.elements.length;
    for (const element of result.elements) {
      if (isCondition(element)) {
        let simplifiedElement: ConditionElement<P> = this.normalize(element, elementCount - 1);
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
}

interface ConditionElementBucketSet<P> {
  predicateSets: P[];
  conditions: Condition<P>[];
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

export const DEFAULT_CONDITION_EXPRESSION_PARSER: ConditionParser = new DefaultConditionParser();
