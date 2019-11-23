import { every } from "lodash";

/**
 * Function telling whether the provided data is of the specified type.
 *
 * @type T Type of the data to check.
 */
export type TypeGuard<T> = (value: unknown, ...options: unknown[]) => value is T;

export const isObject = (value: unknown): value is Object => value !== null && typeof value === "object";

export const isString = (value: unknown): value is String => typeof value === "string";

export const isArray = <T>(value: any, isType?: TypeGuard<T>, length?: number): value is Array<T> =>
  Array.isArray(value) &&
  (length === undefined || value.length === length) &&
  (!isType || every(value, item => isType(item)));

export const isPair = <T>(value: any, isType?: TypeGuard<T>) => isArray(value, isType, 2);

export function getTypeRepresentation(value: any) {
  return isObject(value) ? value.constructor.name : typeof value;
}
