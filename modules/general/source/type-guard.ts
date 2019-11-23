/**
 * Function telling whether the provided data is of the specified type.
 *
 * @type T Type of the data to check.
 */
export type TypeGuard<T> = (value: unknown, ...options: unknown[]) => value is T;
