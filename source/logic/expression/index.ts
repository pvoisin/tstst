export * from "./among";
export * from "./between";
export * from "./conjunction";
export * from "./difference";
export * from "./disjunction";
export * from "./equality";
export * from "./expression";
export * from "./inferiority";
export * from "./negation";
export * from "./superiority";
import {
  AmongPredicateExpression,
  BetweenPredicateExpression,
  ConjunctionExpression,
  DifferentPredicateExpression,
  DisjunctionExpression,
  EqualPredicateExpression,
  isAmongPredicateExpression,
  isBetweenPredicateExpression,
  isConjunctionExpression,
  isDifferenceExpression,
  isDisjunctionExpression,
  isEqualityExpression,
  isExpression,
  isInferiorityExpression,
  isNegationExpression,
  isStrictInferiorityExpression,
  isStrictSuperiorityExpression,
  isSuperiorityExpression,
  LessEqualPredicateExpression,
  LessPredicateExpression,
  MoreEqualPredicateExpression,
  MorePredicateExpression,
  NegationExpression,
} from ".";

//export type OperationExpression<S extends string = string, V = any> = Expression<Operator, Expression<S, V>>;
export type OperationExpression<S extends string = string, V = any> =
  | NegationExpression<S, V>
  | ConjunctionExpression<S, V>
  | DisjunctionExpression<S, V>;

/** Tells whether the provided value is an operation expression. */
export const isOperationExpression = <S extends string, V>(value: any): value is OperationExpression<S, V> => {
  const OPERATION_EXPRESSION_VALIDATORS = {
    ...isNegationExpression.validators,
    ...isConjunctionExpression.validators,
    ...isDisjunctionExpression.validators,
  };
  return isExpression(value, OPERATION_EXPRESSION_VALIDATORS);
};

// export type PredicateExpression<T = any> = Expression<Predicate, T>;
export type PredicateExpression<T = any> =
  | EqualPredicateExpression<T>
  | DifferentPredicateExpression<T>
  | LessPredicateExpression<T>
  | LessEqualPredicateExpression<T>
  | MorePredicateExpression<T>
  | MoreEqualPredicateExpression<T>
  | BetweenPredicateExpression<T>
  | AmongPredicateExpression<T>;
const PREDICATE_EXPRESSION_VALIDATORS = {
  ...isEqualityExpression.validators,
  ...isDifferenceExpression.validators,
  ...isStrictInferiorityExpression.validators,
  ...isInferiorityExpression.validators,
  ...isStrictSuperiorityExpression.validators,
  ...isSuperiorityExpression.validators,
  ...isBetweenPredicateExpression.validators,
  ...isAmongPredicateExpression.validators,
};
export const isPredicateExpression = <T = any>(value: any): value is PredicateExpression<T> =>
  isExpression(value, PREDICATE_EXPRESSION_VALIDATORS);
