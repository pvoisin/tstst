import { Dictionary, isArray, isObject, Validator } from "../..";

/** @example Expression<"X", number[]> → { X: [1, 2, 3] } */
export type Expression<S extends string = string, V = any> = { [K in S]: V };

/** Tells whether the provided value is an expression. */
export const isExpression = <S extends string, V>(
  value: any,
  validators?: Dictionary<Validator>
): value is Expression<S, V> => {
  if (!isObject(value) || isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);
  if (keys.length > 1) {
    return false;
  }

  const operator = keys[0];

  if (validators !== undefined) {
    const validator = validators[operator];
    return !!validator && validator(value[operator]);
  }

  return true;
};

/** Tells whether the provided value is an expression array. */
export const isExpressionArray = <S extends string, V>(
  value: any,
  validators?: Dictionary<Validator>
): value is Expression<S, V>[] => {
  if (!isArray(value) || value.length < 1) {
    return false;
  }

  for (const item of value) {
    if (!isExpression(item, validators)) {
      return false;
    }
  }

  return true;
};
