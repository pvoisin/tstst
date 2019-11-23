import { every } from "lodash";
import { TypeGuard } from "./type-guard";

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

export function getValueRepresentation<T = unknown>(value: T, includeTypeRepresentation: boolean = false): string {
  let representation: string;

  try {
    representation = JSON.stringify(value);
  } catch {
    representation = String(value);
  }

  if (includeTypeRepresentation) {
    representation += ` (${getTypeRepresentation(value)})`;
  }

  return representation;
}

export function getCollectionRepresentation<T = unknown>(
  items: T[],
  includeTypeRepresentation: boolean = false
): string {
  let representation: string;

  if (items) {
    representation =
      "[" + items.map((item: T) => getValueRepresentation(item, includeTypeRepresentation)).join(", ") + "]";
  }

  return representation;
}
