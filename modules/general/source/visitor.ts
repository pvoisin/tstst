/**
 * Function visiting the provided object.
 *
 * @type T Type of the object to visit.
 * @type R Type of the value to return - for flexibility, usually `void`.
 */
export type Visitor<T, R = unknown> = (object: T, ...options: unknown[]) => R;
