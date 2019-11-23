import * as freeze from "deep-freeze";
import { concat, isNil, noop, reject } from "lodash";
import { getItemMap } from "./collection.utility";
import { getValueRepresentation } from "./utility";

export const EMPTY_STRING = "";
export const EMPTY_ARRAY: any[] = [];
freeze(EMPTY_ARRAY);
export const EMPTY_OBJECT: any = {};
freeze(EMPTY_OBJECT);
export const EMPTY_FUNCTION = noop;
freeze(EMPTY_FUNCTION);
export const EMPTY_PATTERN = /^$/;
freeze(EMPTY_PATTERN);

export const EMPTY_MAP = new Map<any, any>();
freeze(EMPTY_MAP);

export const EMPTY_SET = new Set<any>();
freeze(EMPTY_SET);

export const EMPTY_VALUES = [undefined, null, EMPTY_STRING, EMPTY_ARRAY, EMPTY_OBJECT, EMPTY_MAP, EMPTY_SET];
freeze(EMPTY_VALUES);

export const EMPTY_VALUES_MAP = getItemMap(EMPTY_VALUES, getDefaultItemMapKey);
freeze(EMPTY_VALUES_MAP);

export const NOT_EMPTY_MAP = new Map<any, any>();
NOT_EMPTY_MAP.set(123, "ABC");
freeze(NOT_EMPTY_MAP);

export const NOT_EMPTY_SET = new Set<any>();
NOT_EMPTY_SET.add(123);
freeze(NOT_EMPTY_SET);

export const NOT_EMPTY_VALUES = [
  true,
  false,
  NaN,
  123,
  Infinity,
  "🍺",
  EMPTY_FUNCTION,
  { id: 1 },
  ["🍕"],
  EMPTY_PATTERN,
  new Date(),
  new Error(),
  Number(123),
  NOT_EMPTY_MAP,
  NOT_EMPTY_SET,
];
freeze(NOT_EMPTY_VALUES);

export const NOT_EMPTY_VALUES_MAP = getItemMap(NOT_EMPTY_VALUES, getDefaultItemMapKey);
freeze(NOT_EMPTY_VALUES_MAP);

export const NOT_MISSING_VALUES = concat(reject(EMPTY_VALUES, isNil), NOT_EMPTY_VALUES);
freeze(NOT_MISSING_VALUES);

export const NOT_MISSING_VALUES_MAP = getItemMap(NOT_MISSING_VALUES, getDefaultItemMapKey);
freeze(NOT_MISSING_VALUES_MAP);

function getDefaultItemMapKey(value: any, index: number) {
  return getValueRepresentation(value, true);
}
