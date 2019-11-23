/**
 * Object able to provide data of the specified type for the given context.
 *
 * @type C Type of the context for which to provide the data.
 * @type T Type of the data to provide.
 */
export type Provider<C, T> = (context?: C, ...options: unknown[]) => T;
