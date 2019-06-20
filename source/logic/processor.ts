import { Condition, ConditionElement, isCondition } from "./condition";

export type ConditionElementVisitor<P, R = void> = (element: ConditionElement<P>, condition?: Condition<P>) => R;

export interface ConditionWalker {
  walk: <P>(condition: Condition<P>, visitor: ConditionElementVisitor<P>) => void;
}

export class DefaultConditionWalker implements ConditionWalker {
  walk<P>(condition: Condition<P>, visitor: ConditionElementVisitor<P>) {
    if (condition) {
      for (const element of condition.elements) {
        visitor(element, condition);
      }
    }
  }
}

export interface ConditionProcessor<A> {
  processElement: <P>(element: ConditionElement<P>, condition: Condition<P>, accumulator: A) => void;
  processCondition: <P>(condition: Condition<P>, accumulator: A) => void;
  processPredicateSet: <P>(predicates: P, condition: Condition<P>, accumulator: A) => void;
}

export class DefaultConditionProcessor<A> implements ConditionProcessor<A> {
  processElement<P>(element: ConditionElement<P>, condition: Condition<P>, accumulator: A) {
    if (isCondition(element)) {
      this.processCondition(element, accumulator);
    } else {
      this.processPredicateSet(element, condition, accumulator);
    }
  }

  processCondition<P>(condition: Condition<P>, accumulator: A) {
    for (const element of condition.elements) {
      this.processElement(element, condition, accumulator);
    }
  }

  processPredicateSet<P>(predicates: P, condition: Condition<P>, accumulator: A) {
    // ...
  }
}
