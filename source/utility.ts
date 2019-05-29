import * as _ from "lodash";

export function getValueRepresentation(value: any, includeType: boolean = false): string {
  let representation: string;

  try {
    representation = JSON.stringify(value);
  } catch {
    representation = String(value);
  }

  if (includeType) {
    representation += ` (${getTypeRepresentation(value)})`;
  }

  return representation;
}

export function getTypeRepresentation(value: any) {
  return _.isObject(value) ? value.constructor.name : typeof value;
}

export function withSilentConsole<T>(operation: () => T): T {
  let result: T;
  const consoleExists: boolean = typeof console !== "undefined";
  let originalConsoleMethods: any;
  if (consoleExists) {
    originalConsoleMethods = _.pick(console, "log", "info", "warn", "error", "dir");
    for (const methodName in originalConsoleMethods) {
      console[methodName] = _.noop;
    }
  }

  try {
    result = operation.apply(this);
  } finally {
    if (consoleExists) {
      _.assign(console, originalConsoleMethods);
    }
  }

  return result;
}

export const isObject = (value: any): value is Object => value !== null && typeof value === "object";
export const isString = (value: any): value is String => typeof value === "string";
export const isArray = Array.isArray;

export type TypeGuard<T> = (value: any) => value is T;

export interface Factory<T> {
  create(...others: any[]): T;
}

export interface Constructor<T> {
  new (...others: any[]): T;
}

/** Mapping based on the specified model's keys. */
export type Mapping<M, T = any> = { [key in keyof M]?: T };

/** Mapping of the specified models' keys. */
export type KeyMapping<M1, M2> = Mapping<M1, keyof M2>;
