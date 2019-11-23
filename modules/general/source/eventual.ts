/**
 * Usually, used to describe results given by functions that are either
 * synchronous or asynchronous.
 *
 * @example
 *  · `const blah = (…) => string | Promise<string>`
 *  → `const blah = (…) => Eventual<string>`
 *
 * @type T Type of the eventual function result.
 */
export type Eventual<T> = T | Promise<T>;
