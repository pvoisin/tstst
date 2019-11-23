/**
 * Constructs an object of the specified type.
 *
 * @type T Type of the object to construct.
 */
export type Constructor<T> = new (...options: unknown[]) => T;
