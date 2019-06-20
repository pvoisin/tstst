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
export const isArray = <T>(value: any, isType?: TypeGuard<T>, length?: number): value is Array<T> =>
  Array.isArray(value) &&
  (length === undefined || value.length === length) &&
  (!isType || _.every(value, (item) => isType(item)));
export const isPair = <T>(value: any, isType?: TypeGuard<T>) => isArray(value, isType, 2);

export interface Factory<T> {
  create(...others: any[]): T;
}

/**
 * Constructs an object of the specified type.
 *
 * @type T Type of the object to construct.
 */
export type Constructor<T> = new (...others: any[]) => T;

/** Mapping based on the specified model's keys. */
export type Mapping<M, T = any> = { [key in keyof M]?: T };

/** Mapping of the specified models' keys. */
export type KeyMapping<M1, M2> = Mapping<M1, keyof M2>;

/**
 * Creates an object of the specified type.
 *
 * @type T Type of the object to create.
 */
export interface Factory<T> {
  create(...others: any[]): T;
}

/**
 * Provides some data of the specified type for the given context.
 *
 * @type C Type of the context for which to provide the data.
 * @type T Type of the data to provide.
 */
export type Provider<C, T> = (context?: C) => T;

/**
 * Visists the provided object.
 *
 * @type T Type of the object to visit.
 * @type R Type of the value to return - for flexibility, usually `void`.
 */
export type Visitor<T, R = void> = (object: T) => R;

/**
 * Tells whether the provided value is valid.
 *
 * @type T Type of the data to validate.
 * @type R Type of the value to return - for flexibility, usually `void`.
 */
export type Validator<T = any> = (value: T) => boolean;

/**
 * Tells whether the provided data is of the specified type.
 *
 * @type T Type of the data to check.
 */
export type TypeGuard<T> = (value: any) => value is T;

/**
 * Usually, used to qualify results gotten from functions that are either
 * synchronous or asynchronous.
 * In both cases such a function can be awaited for, even if it is synchronous
 * so this type helps to simplify those definitions.
 * Example:
 *  · `const blah = (…) => string | string[] | Promise<string | string[]>`
 *  → `const blah = (…) => Eventual<string | string[]>`
 *
 * @type T Type of the data to check.
 */
export type Eventual<T> = T | Promise<T>;

/**
 * Object able to read the specified type of data, independently of any context.
 *
 * @type T Type of the data to read.
 */
export interface Probe<T> {
  read(): Eventual<T>;
}

/**
 * Either the specified type of data or a provider of that type.
 * Useful for data that either is already available or not yet.
 */
export type Parameter<T> = T | Provider<void, T>;

/**
 * Serializes the provided object.
 *
 * @type T Type of the object to serialize.
 * @type R Type of the value to return - for flexibility, usually `string`.
 */
export type Serializer<T, R = string> = (value: T) => R;

export const DEFAULT_SERIALIZER: Serializer<any> = (value: any) => String(value);
