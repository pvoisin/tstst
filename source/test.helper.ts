import * as _ from "lodash";
import { getItemMap } from "./collection.utility";
import { getValueRepresentation } from "./utility";

export const EMPTY_STRING = "";
export const EMPTY_ARRAY: any[] = [];
Object.freeze(EMPTY_ARRAY);
export const EMPTY_OBJECT: any = {};
Object.freeze(EMPTY_OBJECT);
export const EMPTY_FUNCTION = _.noop;
Object.freeze(EMPTY_FUNCTION);
export const EMPTY_PATTERN = /^$/;
Object.freeze(EMPTY_PATTERN);

export const EMPTY_MAP = new Map<any, any>();
Object.freeze(EMPTY_MAP);

export const EMPTY_SET = new Set<any>();
Object.freeze(EMPTY_SET);

export const EMPTY_VALUES = [undefined, null, EMPTY_STRING, EMPTY_ARRAY, EMPTY_OBJECT, EMPTY_MAP, EMPTY_SET];
Object.freeze(EMPTY_VALUES);

export const EMPTY_VALUES_MAP = getItemMap(EMPTY_VALUES, getDefaultItemMapKey);
Object.freeze(EMPTY_VALUES_MAP);

export const NOT_EMPTY_MAP = new Map<any, any>();
NOT_EMPTY_MAP.set(123, "ABC");
Object.freeze(NOT_EMPTY_MAP);

export const NOT_EMPTY_SET = new Set<any>();
NOT_EMPTY_SET.add(123);
Object.freeze(NOT_EMPTY_SET);

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
Object.freeze(NOT_EMPTY_VALUES);

export const NOT_EMPTY_VALUES_MAP = getItemMap(NOT_EMPTY_VALUES, getDefaultItemMapKey);
Object.freeze(NOT_EMPTY_VALUES_MAP);

export const NOT_MISSING_VALUES = _.concat(_.reject(EMPTY_VALUES, _.isNil), NOT_EMPTY_VALUES);
Object.freeze(NOT_MISSING_VALUES);

export const NOT_MISSING_VALUES_MAP = getItemMap(NOT_MISSING_VALUES, getDefaultItemMapKey);
Object.freeze(NOT_MISSING_VALUES_MAP);

function getDefaultItemMapKey(value: any, index: number) {
  return getValueRepresentation(value, true);
}
